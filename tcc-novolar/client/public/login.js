function validateForm() {
    event.preventDefault();
    var agree = document.getElementById("termosConcordancia").checked;
    if (!agree) {
        alert("Por favor, indique que leu e concorda com os Termos e Condições e a Política de Privacidade.");
        return false;
    }
    return true;
}

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
            alert('Conta não encontrada.');
        }else if(statusCode === 401){
            alert('Senha incorreta.');
        } else {
            alert(`Status desconhecido: ${statusCode}`);
        }
    })
    
   .catch((error) => {
        console.error('Error:', error);
    });
}