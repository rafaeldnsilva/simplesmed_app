// Configuração do banco de dados db.js

// 1. Carrega dotenv no início
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env') // Força o uso de backend/.env
}); // Carrega as variáveis do .env para process.env

// 2. Importa mssql (CommonJS)
const sql = require('mssql');

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_NAME);

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    console.error('Erro: Variáveis de ambiente para o banco de dados não estão definidas.');
    //process.exit(1); // Finaliza o processo com erro
}

// 3. Usa as variáveis do arquivo .env
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME, // Corrigido para usar DB_NAME
    port: parseInt(process.env.DB_PORT, 10) || 1433, // Corrigido para usar DB_PORT
    options: {
        encrypt: true, // Necessário para conexões seguras
        trustServerCertificate: true // Para evitar problemas com certificados em desenvolvimento
    },
    connectionTimeout: 30000, // Timeout de conexão
    requestTimeout: 30000 // Timeout para cada requisição
};
  
async function conectarBD() {
    try {
        // Inicia a pool de conexão apenas se ainda não existir
        if (!sql.pool) {
            await sql.connect(config);
            console.log('Conectado ao banco de dados');
        }
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        throw err;
    }
}

module.exports = {
    conectarBD,
    sql
};
