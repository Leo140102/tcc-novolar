function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") return false;

  for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

  Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

function redirectToLogin() {
    window.location.href = '/login.html';
}

function cadastroUser() {
    document.getElementById('cadastro').addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('nome').value.toString().trim();
        const email = document.getElementById('emailCadastro').value.toString().trim();
        const cpf = document.getElementById('cpf').value.toString().trim();
        const cpfValido = cpf.replace(/\D/g, "");
        console.log("CPFLIMPO" + cpfValido);

        const senha = document.getElementById('senhaCadastro').value.toString().trim();

        if (!nome ||!email ||!cpf ||!senha) {
            alert('Todos os campos são obrigatórios.');
        }

        const emailValido = /\S+@\S+\.\S+/.test(email);
        if (!emailValido) {
            alert('Por favor, insira um email válido.');
            return;
        }

        if (!TestaCPF(cpfValido.toString())) {
            alert('CPF inválido!');
            return;
        }

        const senhaValida = senha.length >= 6;
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
            email,
            senha,
            cpf,
            nome
        };

        const jsonData = JSON.stringify(formCad);
        console.log(jsonData);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        };
        console.log(options);

        fetch('http://localhost:8000/register', options)
           .then(response => {
                if (response.status === 201) {
                    redirectToLogin(); 
                } else if(response.status === 409) {
                    alert('Usuário já cadastrado.');
                }
            })
           .then(data => console.log(data))
           .catch(error => console.error('Erro:', error));
    });
}



