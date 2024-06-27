let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');

}

// Defina a variável globalmente
let minhaVariavel = '';

document.getElementById('sair').addEventListener('click', function () {
    minhaVariavel = '';
    document.getElementById('perfil').innerText = minhaVariavel;
    document.getElementById('userSession').innerText = minhaVariavel;
});

document.getElementById('login').addEventListener('click', function () {
    console.log("entrou click");
    fetch('http://localhost:8000/user/name')
        .then(response => response.json())
        .then(data => {
            minhaVariavel = data.nome;
            document.getElementById('userSession').innerText = minhaVariavel;
        })
        .catch(error => console.error('Erro ao carregar nome do usuário:', error));

});


