

console.log("ENTRA LOGIN.JS");

function logar(){
    console.log("ENTRA logar");
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value

    console.log(
        password);
    
    fetch("http://localhost:8000/login",{
        method: 'POST',
        body: JSON.stringify({
            email:email,
            password:password
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