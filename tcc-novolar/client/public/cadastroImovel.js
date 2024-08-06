
function redirectToLogin() {
    window.location.href = '/login.html';
}

function cadastroUser() {
    // Obtém o elemento do formulário
    const formElement = document.getElementById('cadastroImovel');

    // Define a função de manipulação do evento
    function handleSubmit(event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value.toString().trim();
        const valor = document.getElementById('valor').value.toString().trim();
        const area = document.getElementById('area').value.toString().trim();
        const cpfValido = document.getElementById('area').value.toString().trim();
        console.log("CPFLIMPO" + cpfValido);

        const senha = document.getElementById('senhaCadastro').value.toString().trim();

        if (!nome || !email || !cpf || !senha) {
            callAlert('Todos os campos são obrigatórios.');
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
                } else if (response.status === 409) {
                    callAlert('Usuário já cadastrado.');
                }
            })
            .then(data => console.log(data))
            .catch(error => console.error('Erro:', error));
    }

    // Verifica se o evento já foi adicionado
    if (!formElement.hasAttribute('data-submit-listener-added')) {
        // Adiciona o evento se ainda não foi adicionado
        formElement.addEventListener('submit', handleSubmit);
        // Marca o atributo para indicar que o evento foi adicionado
        formElement.setAttribute('data-submit-listener-added', '');
    }
}

function callAlert(msg) {
    alert(msg);
}

window.alert = function (message, timeout = null) {
    console.log(message);
    mens = document.querySelector('.text'),
        toast = document.querySelector(".toast"),
        closeIcon = document.querySelector(".close"),
        progress = document.querySelector(".progress");

    let timer1, timer2;

    toast.classList.add("active");
    progress.classList.add("active");

    mens.textContent = message;

    timer1 = setTimeout(() => {
        toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
        progress.classList.remove("active");
    }, 5300);


    closeIcon.addEventListener("click", () => {
        toast.classList.remove("active");

        setTimeout(() => {
            progress.classList.remove("active");
        }, 300);

        clearTimeout(timer1);
        clearTimeout(timer2);
    });
}




