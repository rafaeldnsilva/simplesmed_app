// db.js
// Configuração do banco de dados
// Este arquivo é responsável por:
// 1) Conectar ao SQL Server
// 2) Criar a tabela 'Clientes' se não existir
// 3) Fornecer funções para inserir, buscar, atualizar, deletar clientes

/*// 1. Carrega dotenv no início
const path = require('path');
// 2. Importa mssql (CommonJS)
const sql = require('mssql');

// Carrega variáveis de ambiente do arquivo .env (se estiver em /backend/.env) para process.env
require('dotenv').config({
  path: path.join(__dirname, '.env') // Força o uso de backend/.env
}); 

// Exibe variáveis de ambiente p/ debug
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_NAME);

// Se quiser, verifique se não está faltando nada e sair
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    console.error('Erro: Variáveis de ambiente para o banco de dados não estão definidas.');
    //process.exit(1); // Finaliza o processo com erro
}

// 3. Configurações da conexão com MSSQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME, // Corrigido para usar DB_NAME
    port: parseInt(process.env.DB_PORT, 10) || 1433, // Corrigido para usar DB_PORT
    options: {
        encrypt: true, // Necessário para conexões seguras, se estiver usando Azure.
        trustServerCertificate: true // Para evitar problemas com certificados em desenvolvimento. Se usar certificado autoassinado.
    },
    // Opcional: timeout de conexão e de requisição
    connectionTimeout: 30000,
    requestTimeout: 30000
};

// ---------------------
// Variável global p/ pool
let pool = null; // Variável para armazenar a pool de conexão

// A ideia é conectar apenas UMA vez.
// O método sql.connect() retorna uma "pool" de conexão, que podemos reutilizar.
  
async function conectarBD() {
    try {
        // Inicia a pool de conexão apenas se ainda não existir. Se já houver uma pool ativa, não precisamos reconectar.
        if (!pool) {
            pool = await sql.connect(dbConfig);
            console.log('Conectado ao banco de dados SQL Server.');
        } else {
            console.log('Pool de conexão já existente. Não é necessário reconectar.');
        }
        // Verifica se a tabela 'Clientes' existe. Se não existir, cria.
        await criarTabelaSeNaoExistir();
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        throw err; // Propaga o erro para o caller (server.js)
    }
}

// Esta função cria a tabela "Clientes" se ela não existir
async function criarTabelaSeNaoExistir() {
    // Aqui usamos a pool diretamente
  
    // Comando SQL que verifica se a tabela existe; caso contrário, cria
    const createTableQuery = `
      IF NOT EXISTS (
        SELECT * FROM sysobjects 
        WHERE name = 'Clientes' 
        AND xtype = 'U'
      )
      CREATE TABLE Clientes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        TipoCliente NVARCHAR(50),
        Nome NVARCHAR(100),
        CpfCnpj NVARCHAR(18),
        Telefone NVARCHAR(20),
        Email NVARCHAR(100),
        Endereco NVARCHAR(200),
        Equipamento NVARCHAR(100),
        Serie NVARCHAR(100),
        Garantia NVARCHAR(4),
        Observacao NVARCHAR(MAX),
        Relato NVARCHAR(MAX)
      );
    `;
  
    try {
      // pool.request() → faz requisição SQL usando a pool existente
      await pool.request().query(createTableQuery);
      console.log("Tabela 'Clientes' verificada/criada com sucesso.");
    } catch (error) {
      console.error('Erro ao verificar/criar a tabela Clientes:', error);
    }
  }
  
  /* 
  --------------------------------------------
            Funções CRUD (Clientes)
  --------------------------------------------
  */


/*// 1) Criar cliente (INSERT)
async function criarCliente(dados) {
    // "dados" é um objeto com as propriedades que vêm do frontend (nome, cpfCnpj, etc.)
    const queryInsert = `
      INSERT INTO Clientes (
        TipoCliente, Nome, CpfCnpj, Telefone, Email,
        Endereco, Equipamento, Serie, Garantia, Observacao, Relato
      )
      VALUES (
        @TipoCliente, @Nome, @CpfCnpj, @Telefone, @Email,
        @Endereco, @Equipamento, @Serie, @Garantia, @Observacao, @Relato
      )
    `;
  
    try {
      // Reutiliza a mesma pool
      // Montamos a requisição com as inputs do "dados"
      await pool.request()
        .input('TipoCliente',  sql.NVarChar, dados['tipo-cliente'])
        .input('Nome',         sql.NVarChar, dados.nome)
        .input('CpfCnpj',      sql.NVarChar, dados['cpf-cnpj'])
        .input('Telefone',     sql.NVarChar, dados.telefone)
        .input('Email',        sql.NVarChar, dados.email)
        .input('Endereco',     sql.NVarChar, dados.endereco)
        .input('Equipamento',  sql.NVarChar, dados.equipamento)
        .input('Serie',        sql.NVarChar, dados.serie)
        .input('Garantia',     sql.NVarChar, dados.garantia)
        .input('Observacao',   sql.NVarChar, dados.observacao)
        .input('Relato',       sql.NVarChar, dados.relato)
        .query(queryInsert);
  
      console.log('Cliente criado com sucesso no banco de dados.');
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error; // re-throw para capturar no server.js
    }
  }
  
  // 2) Buscar clientes com filtros (ex.: nome, cpfCnpj, telefone)
  async function buscarClientes(filtros) {
    // "filtros" é um objeto com { nome, cpfCnpj, telefone }
  
    // Monta a query básica
    let querySelect = 'SELECT Id, Nome, CpfCnpj, Telefone, Email FROM Clientes WHERE 1=1';
    const params = [];
  
    // Se "filtros.nome" não for vazio, adiciona condicional
    if (filtros.nome) {
      querySelect += ' AND Nome LIKE @Nome';
      params.push({ name: 'Nome', value: `%${filtros.nome}%`, type: sql.NVarChar });
    }
  
    if (filtros.cpfCnpj) {
      querySelect += ' AND CpfCnpj LIKE @CpfCnpj';
      params.push({ name: 'CpfCnpj', value: `%${filtros.cpfCnpj}%`, type: sql.NVarChar });
    }
  
    if (filtros.telefone) {
      querySelect += ' AND Telefone LIKE @Telefone';
      params.push({ name: 'Telefone', value: `%${filtros.telefone}%`, type: sql.NVarChar });
    }
  
    // Executa a query
    try {
      const request = pool.request();
      // Configura cada input param
      params.forEach(p => request.input(p.name, p.type, p.value));
  
      const result = await request.query(querySelect);
      return result.recordset; 
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }
  
  // 3) Listar todos os clientes (sem filtros)
  async function listarTodosClientes() {
    // Executa a query
    try {
      const result = await pool.request().query('SELECT * FROM Clientes');
      return result.recordset;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }
  
  // 4) Atualizar um cliente específico (pelo Id)
  async function atualizarCliente(id, dados) {
    const queryUpdate = `
      UPDATE Clientes
      SET
        TipoCliente = @TipoCliente,
        Nome = @Nome,
        CpfCnpj = @CpfCnpj,
        Telefone = @Telefone,
        Email = @Email,
        Endereco = @Endereco,
        Equipamento = @Equipamento,
        Serie = @Serie,
        Garantia = @Garantia,
        Observacao = @Observacao,
        Relato = @Relato
      WHERE Id = @Id
    `;
  
    try {
      await pool.request()
        .input('Id',           sql.Int,        id)
        .input('TipoCliente',  sql.NVarChar,   dados['tipo-cliente'])
        .input('Nome',         sql.NVarChar,   dados.nome)
        .input('CpfCnpj',      sql.NVarChar,   dados['cpf-cnpj'])
        .input('Telefone',     sql.NVarChar,   dados.telefone)
        .input('Email',        sql.NVarChar,   dados.email)
        .input('Endereco',     sql.NVarChar,   dados.endereco)
        .input('Equipamento',  sql.NVarChar,   dados.equipamento)
        .input('Serie',        sql.NVarChar,   dados.serie)
        .input('Garantia',     sql.NVarChar,   dados.garantia)
        .input('Observacao',   sql.NVarChar,   dados.observacao)
        .input('Relato',       sql.NVarChar,   dados.relato)
        .query(queryUpdate);
  
      console.log(`Cliente ID ${id} atualizado com sucesso.`);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }
  
  // 5) Excluir um cliente específico (pelo Id)
  async function excluirCliente(id) {
    const queryDelete = `DELETE FROM Clientes WHERE Id = @Id`;
  
    try {
      await pool.request()
        .input('Id', sql.Int, id)
        .query(queryDelete);
      console.log(`Cliente ID ${id} foi excluído do banco de dados.`);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
  
  /*
  Por fim, exportamos tudo que o server.js precisa:
  - conectarBD (para iniciar a conexão e criar tabela)
  - criarCliente, buscarClientes, listarTodosClientes, atualizarCliente, excluirCliente
  - e "sql", se quisermos acessar algo específico, mas geralmente nem precisamos exportar o "sql" se todas as operações estiverem aqui.
  */
  
  /*module.exports = {
    conectarBD,
    criarCliente,
    buscarClientes,
    listarTodosClientes,
    atualizarCliente,
    excluirCliente,
    sql // opcional
  };*/

  // db.js (PostgreSQL)

const path = require('path');
const { Pool } = require('pg'); // Usa Pool do pg

// Carrega variáveis de ambiente do .env
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Exibe variáveis (opcional, para debug)
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);

// Validação básica das variáveis obrigatórias
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME) {
  console.error('Variáveis de ambiente incompletas.');
  process.exit(1);
}

// Configurações PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  },
  connectionTimeoutMillis: 20000, // aumenta o tempo de espera para conexão
});


// Conectar e verificar/criar tabela Clientes
async function conectarBD() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Clientes (
        Id SERIAL PRIMARY KEY,
        TipoCliente VARCHAR(50),
        Nome VARCHAR(100),
        CpfCnpj VARCHAR(18),
        Telefone VARCHAR(20),
        Email VARCHAR(100),
        Endereco VARCHAR(200),
        Equipamento VARCHAR(100),
        Serie VARCHAR(100),
        Garantia VARCHAR(4),
        Observacao TEXT,
        Relato TEXT
      );
    `);
    console.log('Conectado ao PostgreSQL e tabela criada/verificada.');
  } catch (err) {
    console.error('Erro ao conectar ou criar tabela:', err);
    throw err;
  }
}

// CRUD PostgreSQL

// 1. Criar cliente
async function criarCliente(dados) {
  const query = `
    INSERT INTO Clientes (
      TipoCliente, Nome, CpfCnpj, Telefone, Email,
      Endereco, Equipamento, Serie, Garantia, Observacao, Relato
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
  `;
  
  const values = [
    dados['tipo-cliente'], dados.nome, dados['cpf-cnpj'], dados.telefone,
    dados.email, dados.endereco, dados.equipamento, dados.serie,
    dados.garantia, dados.observacao, dados.relato
  ];

  try {
    await pool.query(query, values);
    console.log('Cliente criado com sucesso.');
  } catch (err) {
    console.error('Erro ao criar cliente:', err);
    throw err;
  }
}

// 2. Buscar clientes com filtros
async function buscarClientes(filtros) {
  let query = 'SELECT Id, Nome, CpfCnpj, Telefone, Email FROM Clientes WHERE 1=1';
  const values = [];
  let i = 1; // índice de parâmetro PostgreSQL: $1, $2, ...

  if (filtros.nome) {
    query += ` AND Nome ILIKE $${i++}`;
    values.push(`%${filtros.nome}%`);
  }
  if (filtros.cpfCnpj) {
    query += ` AND CpfCnpj ILIKE $${i++}`;
    values.push(`%${filtros.cpfCnpj}%`);
  }
  if (filtros.telefone) {
    query += ` AND Telefone ILIKE $${i++}`;
    values.push(`%${filtros.telefone}%`);
  }

  try {
    const res = await pool.query(query, values);
    return res.rows;
  } catch (err) {
    console.error('Erro ao buscar clientes:', err);
    throw err;
  }
}

// 3. Listar todos os clientes
async function listarTodosClientes() {
  try {
    const res = await pool.query('SELECT * FROM Clientes');
    return res.rows;
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
    throw err;
  }
}

// 4. Atualizar cliente
async function atualizarCliente(id, dados) {
  const query = `
    UPDATE Clientes SET
      TipoCliente=$1, Nome=$2, CpfCnpj=$3, Telefone=$4, Email=$5,
      Endereco=$6, Equipamento=$7, Serie=$8, Garantia=$9,
      Observacao=$10, Relato=$11
    WHERE Id=$12
  `;

  const values = [
    dados['tipo-cliente'], dados.nome, dados['cpf-cnpj'], dados.telefone,
    dados.email, dados.endereco, dados.equipamento, dados.serie,
    dados.garantia, dados.observacao, dados.relato, id
  ];

  try {
    await pool.query(query, values);
    console.log(`Cliente ${id} atualizado com sucesso.`);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    throw err;
  }
}

// 5. Excluir cliente
async function excluirCliente(id) {
  const query = 'DELETE FROM Clientes WHERE Id=$1';

  try {
    await pool.query(query, [id]);
    console.log(`Cliente ${id} excluído com sucesso.`);
  } catch (err) {
    console.error('Erro ao excluir cliente:', err);
    throw err;
  }
}

// Exportar métodos para uso em server.js
module.exports = {
  conectarBD,
  criarCliente,
  buscarClientes,
  listarTodosClientes,
  atualizarCliente,
  excluirCliente,
  pool // Opcional, caso precise
};

