// Configuração do banco de dados
require('dotenv').config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_NAME);

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    console.error('Erro: Variáveis de ambiente para o banco de dados não estão definidas.');
    //process.exit(1); // Finaliza o processo com erro
}

const sql = require('mssql');

/*const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME, // Corrigido para usar DB_NAME
    options: {
        encrypt: true, // Necessário para conexões seguras
        trustServerCertificate: true // Para evitar problemas com certificados em desenvolvimento
    },
    connectionTimeout: 30000, // Timeout de conexão
    requestTimeout: 30000 // Timeout para cada requisição
};*/

const config = {
    user: 'rafael',
    password: 'simples',
    server: 'G15-I1300-A20P',
    database: 'simplesmed',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Use this if you're using self-signed certificates
    },
    port: 1433,
    connectionTimeout: 60000, // Tempo limite de conexão (60 segundos)
    requestTimeout: 60000, // Tempo limite de requisição (60 segundos)
  };
  
async function conectarBD() {
    try {
        await sql.connect(config);
        console.log('Conectado ao banco de dados');
    } catch (err) {
        console.error('Erro ao conectar ao banco:', err);
        throw err;
    }
}

//conectarBD();

module.exports = {
    conectarBD,
    sql
};
