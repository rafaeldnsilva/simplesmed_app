const express = require('express');
const cors = require('cors'); // Permitir requisições do frontend
const { conectarBD, sql } = require('./db'); // Importa a conexão com o banco
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
//app.use(express.json()); // Para processar JSON no corpo da requisição
app.use(express.json({ limit: '10mb' })); // Configura o limite de tamanho da requisição

// Endpoint para salvar clientes
app.post('/api/clientes', async (req, res) => {
    console.log('Dados recebidos:', req.body); // Adiciona log para debug
    try {
        const pool = await sql.connect(); // Garante que a conexão seja reutilizada
        // Dados enviados pelo frontend
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
 
        console.log('Dados recebidos:', req.body);
        console.log('Comprimento do campo Telefone:', telefone.length);
        console.log('Valor do campo Telefone:', telefone);
        console.log('Comprimento do campo Email:', email.length);
        console.log('Valor do campo Email:', email);
        console.log('Comprimento do campo Serie:', serie.length);
        console.log('Valor do campo Serie:', serie);
        console.log('Comprimento do campo Observacao:', observacao.length);
        console.log('Valor do campo Observacao:', observacao);
        console.log('Comprimento do campo Relato:', relato.length);
        console.log('Valor do campo Relato:', relato);// Log para verificar valor de relato

        console.log('Preparando para inserir no banco.');

        // Comando SQL para inserir os dados
        const query = `
            INSERT INTO Clientes (TipoCliente, Nome, CpfCnpj, Telefone, Email, Endereco, Equipamento, Serie, Garantia, Observacao, Relato)
            VALUES (@TipoCliente, @Nome, @CpfCnpj, @Telefone, @Email, @Endereco, @Equipamento, @Serie, @Garantia, @Observacao, @Relato)
        `;

        // Executa o comando SQL
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

        res.status(200).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
        console.error('Detalhes do erro:', error.message); // Log adicional para detalhes do erro
        res.status(500).json({ error: 'Erro ao salvar os dados no banco.' });
    }
});

// Endpoint para buscar clientes
app.post('/api/clientes/buscar', async (req, res) => {
    const { nome, cpfCnpj, telefone } = req.body;
    console.log('Parâmetros de busca recebidos:', req.body); // Adiciona log para debug

    try {
        const pool = await sql.connect(); // Garante que a conexão seja reutilizada
        let query = "SELECT Nome, CpfCnpj, Telefone, Email FROM Clientes WHERE 1=1";
        const params = [];

        if (nome) {
            query += " AND Nome LIKE @Nome";
            params.push({ name: 'Nome', value: `%${nome}%`, type: sql.NVarChar });
        }

        if (cpfCnpj) {
            query += " AND CpfCnpj LIKE @CpfCnpj";
            params.push({ name: 'CpfCnpj', value: `%${cpfCnpj}%`, type: sql.NVarChar });
        }

        if (telefone) {
            query += " AND Telefone LIKE @Telefone";
            params.push({ name: 'Telefone', value: `%${telefone}%`, type: sql.NVarChar });
        }

        console.log('Query:', query);
        console.log('Params:', params);

        const request = pool.request();
        params.forEach(param => {
            request.input(param.name, param.type, param.value);
        });

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar clientes no banco de dados.' });
    }
});

// Inicia o servidor apenas após a conexão com o banco
conectarBD().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
});

// Endpoint para obter a lista de clientes
/*app.get('/api/clientes', async (req, res) => {
    try {
        // Criar uma nova requisição
        const request = new sql.Request();

        // Executar a consulta SQL
        const result = await request.query('SELECT * FROM Clientes');

        // Enviar os dados como resposta
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar os clientes:', error);
        res.status(500).json({ error: 'Erro ao buscar os clientes.' });
    }
});*/