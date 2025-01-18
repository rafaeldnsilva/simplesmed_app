const express = require('express');
const cors = require('cors'); // Permitir requisições do frontend
const { conectarBD, sql } = require('./db'); // Importa a conexão com o banco
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1433;


// Middlewares
app.use(cors());
app.use(express.json()); // Para processar JSON no corpo da requisição

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
            relato,
        } = req.body;

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
            .input('Observacao', sql.NText, observacao)
            .input('Relato', sql.NText, relato)
            .query(query);

        res.status(200).json({ message: 'Cliente cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
        res.status(500).json({ error: 'Erro ao salvar os dados no banco.' });
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
