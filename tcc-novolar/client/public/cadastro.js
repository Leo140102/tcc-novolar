document.getElementById('cadastro-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Coleta os valores dos campos do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;


    // Cria um objeto com os dados do formulário
    const formCad = {
        nome,
        email,
        senha
    };

    // Transforma o objeto em uma string JSON
    const jsonData = JSON.stringify(formCad);

    // Define as opções para a requisição fetch
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    };

    // Envia os dados para a rota backend
    fetch('https://seusite.com/api/cadastro', options)
       .then(response => response.json())
       .then(data => console.log(data))
       .catch(error => console.error('Erro:', error));
});
