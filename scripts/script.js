
function salvar() {
    const form = document.getElementById('cliente-form');
    const formData = new FormData(form);

    console.log('Dados Salvos:', Object.fromEntries(formData));

    alert("Ordem de serviço salva com sucesso!");
}

function imprimir() {
const form = document.getElementById('cliente-form');
const formData = new FormData(form);


let relatorio = `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #4CAF50;
        }
        h2 {
            color: #333;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 5px;
            margin-bottom: 20px;
        }
        .relatorio-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #fff;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-weight: bold;
            color: #333;
        }
        .observacao, .relato {
            margin-top: 10px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .endereco {
            margin-top: 20px;
            font-size: 10px;
            text-align: right;
            color: #666;
            display: flex;
        }
    </style>
</head>
<body>
    <div class="relatorio-container">

        <center>
            <figure>
                <img src="/logotipo-simplesmed.png" width="150" height="100">
            </figure>
        </center>

        <p id="endereco">Av. Carneiro da Cunha, 212, Torre, João Pessoa - PB <br>Tel. 83 3021-6746 / 83 98845-2049 <br> E-mail: contatosimplesmed@gmail.com</p>
        
        <h4>Informações do Cliente</h4>
        
        <div class="section">
            <table>
                <tr>
                    <th>Nome</th>
                    <td>${formData.get('nome')}</td>
                </tr>
                <tr>
                    <th>CPF/CNPJ</th>
                    <td>${formData.get('cpf-cnpj')}</td>
                </tr>
                <tr>
                    <th>Telefone</th>
                    <td>${formData.get('telefone')}</td>
                </tr>
                <tr>
                    <th>E-mail</th> 
                    <td>${formData.get('email')}</td>
                </tr>
                <tr>
                    <th>Endereço</th>
                    <td>${formData.get('endereco')}</td>
                </tr>
                <tr>
                    <th>Equipamento</th>
                    <td>${formData.get('equipamento')}</td>
                </tr>
                <tr>
                    <th>Série</th>
                    <td>${formData.get('serie')}</td>
                </tr>

                <tr>
                    <th>Garantia</th>
                    <td>${formData.get('garantia')}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Observações</h2>
            <div class="observacao">${formData.get('observacao')}</div>
        </div>

        <div class="section">
            <h2>Relato do Cliente</h2>
            <div class="relato">${formData.get('relato')}</div>
        </div>
    </div>
</body>
</html>
`;



/*let relatorio = 'relatorio.html';

const newWindow = window.open(relatorio);
newWindow.onload = function () {
    newWindow.print();
};*/


const newWindow = window.open();
newWindow.document.write(relatorio);
newWindow.document.close();
newWindow.print();
}


function enviarEmail() {
    const form = document.getElementById('cliente-form');
    const formData = new FormData(form);

    const emailBody = `
        Cliente: ${formData.get('nome')}
        Telefone: ${formData.get('telefone')}
        Equipamento: ${formData.get('equipamento')}
        Série: ${formData.get('serie')}
        Garantia: ${formData.get('garantia')}
        Observação: ${formData.get('observacao')}
        Relato do Cliente: ${formData.get('relato')}
    `;
    
    alert("Ordem de serviço enviada por e-mail!");
    console.log("Enviando e-mail com os dados: ", emailBody);
}
