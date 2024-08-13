
function redirectToLogin() {
    window.location.href = '/login.html';
}


fetch('http://localhost:8000/user/id')
    .then(response => response.json())
    .then(data => {
        var idLocatario = data.myGlobalVariableId;
        console.log("idLocatario ->" + idLocatario)
        cadastroImovel(idLocatario)
    })
    .catch(error => console.error('Erro ao carregar nome do usuário:', error));

function cadastroImovel(locatario_id) {
    // Obtém o elemento do formulário
    const formElement = document.getElementById('cadastroImovel');
    // Define a função de manipulação do evento
    function handleSubmit(event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value.toString().trim();
        const valor = document.getElementById('valor').value.toString().trim();
        const area = document.getElementById('area').value.toString().trim();
        const endereco = document.getElementById('endereco').value.toString().trim();
        const descricao = document.getElementById('descricao').value.toString().trim();


        const idadeRadio = document.getElementsByName('idade');
        const tipoRadio = document.getElementsByName('tipo');
        const sexoRadio = document.getElementsByName('gender')
        const animaisRadio = document.getElementsByName('animais')
        const fumarRadio = document.getElementsByName('fumar')

        let selectedValueIdade;
        let selectedValueTipo;
        let selectedValueSexo;
        let selectedValueAnimais;
        let selectedValueFumar;

        let idade
        let tipo
        let sexo
        let animais
        let fumar

        for (let i = 0; i < idadeRadio.length; i++) {
            if (idadeRadio[i].checked) {
                selectedValueIdade = idadeRadio[i].id;
                break;
            }
        }

        if (selectedValueIdade == "maior") {
            idade = "+18"
        } else if (selectedValueIdade === "intervalo1") {
            idade = "17-25"
        } else if (selectedValueIdade === "intervalo2") {
            idade = "25-35"
        } else if (selectedValueIdade === "qualquer") {
            idade = "Qualquer idade"
        }

        for (let i = 0; i < tipoRadio.length; i++) {
            if (tipoRadio[i].checked) {
                selectedValueTipo = tipoRadio[i].id;
                break;
            }
        }

        if (selectedValueTipo == "maior") {
            tipo = "Casa"
        } else if (selectedValueTipo === "intervalo1") {
            tipo = "Apartamento"
        } else if (selectedValueTipo === "intervalo2") {
            tipo = "República"
        } else if (selectedValueTipo === "qualquer") {
            tipo = "Kitnet"
        }

        for (let i = 0; i < sexoRadio.length; i++) {
            if (sexoRadio[i].checked) {
                selectedValueSexo = sexoRadio[i].id;
                break;
            }
        }

        if (selectedValueSexo == "female") {
            sexo = "Feminino"
        } else if (selectedValueSexo === "male") {
            sexo = "Masculino"
        } else if (selectedValueSexo === "ambos") {
            sexo = "Ambos"
        }

        for (let i = 0; i < animaisRadio.length; i++) {
            if (animaisRadio[i].checked) {
                selectedValueAnimais = animaisRadio[i].id;
                break;
            }
        }

        if (selectedValueAnimais == "permitidoA") {
            animais = "Permitido"
        } else if (selectedValueAnimais === "proibidoA") {
            animais = "Proibido"
        }

        for (let i = 0; i < fumarRadio.length; i++) {
            if (fumarRadio[i].checked) {
                selectedValueFumar = fumarRadio[i].id;
                break;
            }
        }

        if (selectedValueFumar == "permitidoF") {
            fumar = "Permitido"
        } else if (selectedValueFumar === "proibidoF") {
            fumar = "Proibido"
        }

        if (!titulo || !valor || !area || !endereco || !descricao) {
            callAlert('Todos os campos são obrigatórios.');
        }


        console.log("TESTE ID LOCATARIO ---> " + locatario_id)
        const formCad = {
            tipo,
            valor,
            area,
            descricao,
            locatario_id,
            endereco,
            titulo,
            idade,
            sexo,
            animais,
            fumar,

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

        fetch('http://localhost:8000/registerImovel', options)
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




