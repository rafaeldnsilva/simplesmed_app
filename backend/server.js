// server.js (Usando CommonJS)
// Arquivo principal do servidor Express
// 1) Faz setup do servidor (porta, middlewares, etc.)
// 2) Chama conectarBD() para iniciar conexão
// 3) Define rotas que usam as funções do db.js

const express = require('express');
const cors = require('cors'); // Permitir requisições do frontend

// Importa as funções do db.js
const {
    conectarBD, // Importa a conexão com o banco sem o require('./db').default
    criarCliente,
    buscarClientes,
    listarTodosClientes,
    atualizarCliente,
    excluirCliente
  } = require('./db');

// Carrega dotenv aqui também, se quiser (não é obrigatório se já carrega no db.js)
require('dotenv').config();

// Verifica se está em modo de desenvolvimento
const dev = process.env.NODE_ENV !== 'production';
const app = express({ dev });
console.log('NODE_ENV:', process.env.NODE_ENV);

// Define a porta (use DB_PORT para banco e outra var para a app, ex.: APP_PORT)
const PORT = parseInt(process.env.APP_PORT, 10) || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Para processar JSON no corpo da requisição e configurar o limite de tamanho da requisição

// Inicia conexão com o banco antes de configurar as rotas
// Conecta ao banco e, então, inicia o servidor
conectarBD()
  .then(() => {
    console.log('Conexão ao banco bem-sucedida. Configurando rotas...');

    // Defina aqui suas rotas:

    // -------------------------------
    // ROTA CREATE (salvar novo cliente)
    // -------------------------------
    app.post('/api/clientes', async (req, res) => {
      try {
        // "req.body" contém os dados enviados pelo frontend
        await criarCliente(req.body);
        return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        return res.status(500).json({ error: 'Erro ao salvar cliente no banco.' });
      }
    });

    // -------------------------------
    // ROTA READ (filtros) - ex.: buscar
    // -------------------------------
    app.post('/api/clientes/buscar', async (req, res) => {
      try {
        // "req.body" pode ter { nome, cpfCnpj, telefone }
        const clientes = await buscarClientes(req.body);
        return res.status(200).json(clientes);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return res.status(500).json({ error: 'Erro ao buscar clientes no banco de dados.' });
      }
    });

    // -------------------------------
    // ROTA READ (listar todos)
    // -------------------------------
    app.get('/api/clientes', async (req, res) => {
      try {
        const todos = await listarTodosClientes();
        return res.status(200).json(todos);
      } catch (error) {
        console.error('Erro ao listar clientes:', error);
        return res.status(500).json({ error: 'Erro ao listar clientes no banco de dados.' });
      }
    });

    // -------------------------------
    // ROTA UPDATE (editar cliente por ID)
    // -------------------------------
    app.put('/api/clientes/:id', async (req, res) => {
      try {
        const { id } = req.params;   // ID passado na URL
        await atualizarCliente(id, req.body);  // req.body tem os novos dados
        return res.status(200).json({ message: `Cliente ID ${id} atualizado com sucesso!` });
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        return res.status(500).json({ error: 'Erro ao atualizar cliente no banco de dados.' });
      }
    });

    // -------------------------------
    // ROTA DELETE (excluir cliente por ID)
    // -------------------------------
    app.delete('/api/clientes/:id', async (req, res) => {
      try {
        const { id } = req.params;
        await excluirCliente(id);
        return res.status(200).json({ message: `Cliente ID ${id} excluído com sucesso!` });
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        return res.status(500).json({ error: 'Erro ao excluir cliente no banco de dados.' });
      }
    });

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1); // Encerra o processo com código de erro
  });