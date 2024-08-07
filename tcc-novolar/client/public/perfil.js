function get_username(id) {
    fetch(`http://localhost:8000/imovel/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('nok')
            }
        })
        .then(dados => {
            if (dados.length === 0) {
                console.log('erro!')
            } else {
                document.querySelector('#username').textContent = dados[0].titulo;
            }

        })
}

function excluirUser(id) {
    fetch(`http://localhost:8000/imovel/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('nok')
            }
        })
        .then(dados => {
            if (dados.length === 0) {
                console.log('erro!')
            } else {
                document.querySelector('#username').textContent = dados[0].titulo;
            }

        })
}