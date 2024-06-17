function logar(){
    var user = document.getElementById("user").value
    var password = document.getElementById("password").value

    console.log(JSON.stringify({
        user:user,
        password
    }))

    fetch("login",{
        method: 'POST',
        body: JSON.stringify({
            user:user,
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