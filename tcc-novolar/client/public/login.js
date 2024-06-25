
function logar() {
    console.log("Entrando...");

    var email = document.getElementById("email").value;
    var senha = document.getElementById("senha").value;

    console.log(JSON.stringify({
        email: email,
        senha: senha
    }));

    fetch('http://localhost:8000/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            senha: senha
        }),
        headers: { "content-type": "application/json" }
    })
        .then(async (resp) => {
            var statusCode = await resp.status;
            if (statusCode === 200) {
                window.location.href = "/index.html";
            } else if (statusCode === 404) {
                callAlert('Conta não encontrada.');
            } else if (statusCode === 401) {
                callAlert('Senha incorreta.');
            } else {
                callAlert(`Status desconhecido: ${statusCode}`);
            }
        })

        .catch((error) => {
            console.error('Error:', error);
        });
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