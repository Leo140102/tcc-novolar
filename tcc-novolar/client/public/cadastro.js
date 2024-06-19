function validaCPF(cpf) {
    let cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length!== 11) {
        return false;
    }

    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }
    resto = soma % 11;

    if (((resto < 2) && resto!== parseInt(cpfLimpo.substring(9, 10))) || ((resto >= 2) && (resto - 11)!== parseInt(cpfLimpo.substring(9, 10)))) {
        return false;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }
    resto = soma % 11;

    if (((resto < 2) && resto!== parseInt(cpfLimpo.substring(10, 11))) || ((resto >= 2) && (resto - 11)!== parseInt(cpfLimpo.substring(10, 11)))) {
        return false;
    }

    return true;
}

document.getElementById('cadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!nome ||!email ||!cpf ||!senha) {
        alert('Todos os campos são obrigatórios.');
    }

    const emailValido = /\S+@\S+\.\S+/.test(email);
    if (!emailValido) {
        alert('Por favor, insira um email válido.');
        return; 
    }

    const cpfValido = /^\d{11}$/.test(cpf); 
    if (!cpfValido) {
        if(!validaCPF(cpfValido)){
            alert('CPF inválido.');
        }    
        return; 
    }


    const senhaValida = senha.length > 6;
    if (!senhaValida) {
        alert('A senha deve ter mais de 6 caracteres.');
        return; 
    }

     const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(senha);
    if (!senhaSegura) {
        alert('A senha deve conter letras maiúsculas, minúsculas e números.');
        return; 
    }

    const formCad = {
        nome,
        email,
        cpf,
        senha
    };

    const jsonData = JSON.stringify(formCad);

    console.log(jsonData)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    };

    console.log(options)

    fetch('https://seusite.com/api/cadastro', options)
       .then(response => response.json())
       .then(data => console.log(data))
       .catch(error => console.error('Erro:', error));
});
