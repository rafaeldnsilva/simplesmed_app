const sql = require('mssql');

const config = {
    user: 'rafael',
    password: 'simples',
    server: 'G15-I1300-A20P',
    database: 'simplesmed',
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Use this if you're using self-signed certificates
    }
};


sql.connect(config).then(pool => {
    console.log('Conexão bem-sucedida');
}).catch(err => {
    console.error('Erro ao conectar:', err);
});


const request = new sql.Request();
request.query('SELECT * FROM clientes').then(result => {
    console.dir(result);
}).catch(err => {
    console.error('Erro ao executar a consulta:', err);
});
