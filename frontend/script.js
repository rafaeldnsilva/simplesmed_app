// script.js

// 1) Função SALVAR - para uso em index.html
async function salvar() {
    const form = document.getElementById('cliente-form');
    const formData = new FormData(form);

    // Monta o objeto "dados" para enviar ao backend
    const dados = {
        'tipo-cliente': formData.get('tipo-cliente'),
        nome: formData.get('nome'),
        'cpf-cnpj': formData.get('cpf-cnpj'),
        telefone: formData.get('telefone'),
        email: formData.get('email'),
        endereco: formData.get('endereco'),
        equipamento: formData.get('equipamento'),
        serie: formData.get('serie'),
        garantia: formData.get('garantia'),
        observacao: formData.get('observacao'),
        relato: formData.get('relato')
    };

    console.log('Dados capturados do formulário:', dados);

    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            alert('Dados salvos com sucesso!');
        } else {
            const error = await response.json();
            console.error('Erro do servidor:', error);
            alert('Erro ao salvar dados: ' + error.message);
        }
    } catch (err) {
        console.error('Erro ao enviar requisição:', err);
        alert('Erro ao salvar dados.');
    }
}

// 2) Função BUSCAR - para uso em ordem.html
async function buscarClientes() {
    const form = document.getElementById('ordem-form');
    const formData = new FormData(form);

    // Captura dos valores dos campos de busca
    const nome = formData.get('searchNome');
    const cpfCnpj = formData.get('searchCPF');
    const telefone = formData.get('searchTelefone');

    // (Removemos aquele if que verificava "nomeInput" etc., pois não existem)

    // Monta um objeto "dados" com os filtros
    const dados = { nome, cpfCnpj, telefone };

    console.log('Enviando requisição de busca com:', dados);

    try {
        const response = await fetch('http://localhost:3000/api/clientes/buscar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            const clientes = await response.json();
            console.log('Dados recebidos:', clientes);
            exibirClientes(clientes);
        } else {
            const error = await response.json();
            console.error('Erro ao buscar clientes:', error);
            alert('Erro ao buscar clientes: ' + error.message);
        }
    } catch (error) {
        console.error('Erro na requisição de busca:', error);
        alert('Erro na requisição: ' + error.message);
    }
}

// 3) Função para exibir lista de clientes na tabela da ordem.html
function exibirClientes(clientes) {
    const tabela = document.getElementById('clientes-table').getElementsByTagName('tbody')[0];
    tabela.innerHTML = '';

    clientes.forEach(cliente => {
        const row = tabela.insertRow();

        const celulaNome = row.insertCell(0);
        celulaNome.textContent = cliente.Nome;

        const celulaCpfCnpj = row.insertCell(1);
        celulaCpfCnpj.textContent = cliente.CpfCnpj;

        const celulaTelefone = row.insertCell(2);
        celulaTelefone.textContent = cliente.Telefone;

        const celulaEmail = row.insertCell(3);
        celulaEmail.textContent = cliente.Email;

        const celulaAcoes = row.insertCell(4);
        celulaAcoes.innerHTML = `
            <button onclick="editarCliente(${cliente.Id})">Editar</button>
            <button onclick="excluirCliente(${cliente.Id})">Excluir</button>
        `;
    });
}

// 4) Funções de Impressão, E-mail etc. (opcionais)
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

// 5) Exemplo de edição e exclusão (ainda não implementadas no backend?):
function editarCliente(id) {
    alert('Editar cliente com ID: ' + id);
}

function excluirCliente(id) {
    alert('Excluir cliente com ID: ' + id);
}

// 6) Escuta de eventos para o DOM
document.addEventListener('DOMContentLoaded', function() {
    // Tenta obter cada formulário
    const clienteForm = document.getElementById('cliente-form'); // 1. Tenta obter o formulário de cadastro
    const ordemForm = document.getElementById('ordem-form');  // 2. Tenta obter o formulário de busca

    // Se existir "cliente-form" no DOM, significa que estamos no index.html
    // Se existir 'cliente-form', definimos o listener para salvar()
    if (clienteForm) {
        clienteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            salvar();
        });
    }

    // Se existir "ordem-form" no DOM, significa que estamos no ordem.html
    // Se existir 'ordem-form', definimos o listener para buscarClientes()
    if (ordemForm) {
        ordemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            buscarClientes();
        });
    }
});



/*
// Função para carregar e exibir os clientes quando o botão "Buscar" é clicado
async function buscarClientes() {
    const form = document.getElementById('ordem-form');
    const formData = new FormData(form);

    // Captura dos valores dos campos de busca
    const nome = formData.get('searchNome');
    const cpfCnpj = formData.get('searchCPF');
    const telefone = formData.get('searchTelefone');

    // Verifique se os elementos foram encontrados
    if (!nomeInput || !cpfInput || !telefoneInput) {
        console.error('Erro: Um ou mais campos de entrada não foram encontrados.');
        alert('Erro: Um ou mais campos de entrada não foram encontrados.');
        return;
    }

    const dados = { nome, cpfCnpj, telefone };

    try {
        console.log('Enviando requisição com:', dados); // Log para debug

        // Fazer a requisição com os parâmetros de busca
        const response = await fetch('http://localhost:3000/api/clientes/buscar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8' // Certifique-se do charset
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            const clientes = await response.json();
            console.log('Dados recebidos:', clientes); // Log para debug
            exibirClientes(clientes);
        } else {
            const error = await response.json();
            console.error('Erro ao buscar clientes:', error);
            alert('Erro ao buscar clientes: ' + error.message);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro na requisição: ' + error.message);
    }
}

// Funções temporárias para os botões de ação
function editarCliente(id) {
    alert('Editar cliente com ID: ' + id);
}

function excluirCliente(id) {
    alert('Excluir cliente com ID: ' + id);
}

document.getElementById('cliente-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    salvar(); // Chama a função salvar
});


document.getElementById('ordem-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    buscarClientes(); // Chama a função buscarClientes
});*/
