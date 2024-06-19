

console.log("ENTRA LOGIN.JS");

function logar(){
    console.log("ENTRA logar");
    var email = document.getElementById("email").value
    var senha = document.getElementById("password").value
    console.log(JSON.stringify({
        email:email,
        senha:senha
    }));
    
    fetch('http://localhost:8000/login',{
        
        method: 'POST',
        body: JSON.stringify({
            email:email,
            senha:senha
        }),
        headers:{"content-type" : "application/json"}
    })

    .then(async (resp) =>{
        var status = await resp.text()
        console.log(status)
        if(status == 'conectado'){
            location.href("/index.html")
        }else{
            alert('nome ou senha inválidos!')
        }
    })
}