// server.js (Usando CommonJS)

const express = require('express');
const cors = require('cors'); // Permitir requisições do frontend
const { conectarBD, sql } = require('./db'); // Importa a conexão com o banco sem o .default
require('dotenv').config(); // Carrega env se quiser rodar aqui também (ou só no db.js)

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Para processar JSON no corpo da requisição e configurar o limite de tamanho da requisição

// Inicia conexão com o banco antes de configurar as rotas
conectarBD()
  .then(() => {
    console.log('Conexão ao banco bem-sucedida. Configurando rotas...');

    // Defina aqui suas rotas:
    app.post('/api/clientes', async (req, res) => {
      try {
        // Reutiliza a pool iniciada
        const pool = sql.getPool();
        if (!pool) {
          return res.status(500).json({ error: 'Pool de conexão não está inicializada' });
        }

        // Extraindo campos do body
        const {
          'tipo-cliente': tipoCliente,
          nome,
          'cpf-cnpj': cpfCnpj,
          telefone,
          email,
          endereco,
          equipamento,
          serie,
          garantia,
          observacao,
          relato
        } = req.body;

        // Monta query
        const query = `
          INSERT INTO Clientes (
            TipoCliente, Nome, CpfCnpj, Telefone, Email,
            Endereco, Equipamento, Serie, Garantia, Observacao, Relato
          ) VALUES (
            @TipoCliente, @Nome, @CpfCnpj, @Telefone, @Email,
            @Endereco, @Equipamento, @Serie, @Garantia, @Observacao, @Relato
          )
        `;

        await pool.request()
          .input('TipoCliente', sql.NVarChar, tipoCliente)
          .input('Nome', sql.NVarChar, nome)
          .input('CpfCnpj', sql.NVarChar, cpfCnpj)
          .input('Telefone', sql.NVarChar, telefone)
          .input('Email', sql.NVarChar, email)
          .input('Endereco', sql.NVarChar, endereco)
          .input('Equipamento', sql.NVarChar, equipamento)
          .input('Serie', sql.NVarChar, serie)
          .input('Garantia', sql.NVarChar, garantia)
          .input('Observacao', sql.NVarChar, observacao)
          .input('Relato', sql.NVarChar, relato)
          .query(query);

        return res.status(200).json({ message: 'Cliente cadastrado com sucesso!' });
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        return res.status(500).json({ error: 'Erro ao salvar os dados no banco.' });
      }
    });

    // Rota de busca
    app.post('/api/clientes/buscar', async (req, res) => {
      try {
        const pool = sql.getPool();
        if (!pool) {
          return res.status(500).json({ error: 'Pool de conexão não está inicializada' });
        }

        const { nome, cpfCnpj, telefone } = req.body;

        let query = 'SELECT Nome, CpfCnpj, Telefone, Email FROM Clientes WHERE 1=1';
        const params = [];

        if (nome) {
          query += ' AND Nome LIKE @Nome';
          params.push({ name: 'Nome', value: `%${nome}%`, type: sql.NVarChar });
        }

        if (cpfCnpj) {
          query += ' AND CpfCnpj LIKE @CpfCnpj';
          params.push({ name: 'CpfCnpj', value: `%${cpfCnpj}%`, type: sql.NVarChar });
        }

        if (telefone) {
          query += ' AND Telefone LIKE @Telefone';
          params.push({ name: 'Telefone', value: `%${telefone}%`, type: sql.NVarChar });
        }

        const request = pool.request();
        params.forEach(param => request.input(param.name, param.type, param.value));

        const result = await request.query(query);
        return res.status(200).json(result.recordset);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ error: 'Erro ao buscar clientes no banco de dados.' });
      }
    });

    // Por fim, inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  });
