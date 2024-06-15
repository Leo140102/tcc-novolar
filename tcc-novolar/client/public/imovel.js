window.onload = () => {
    get_imoveis(id);
}

function get_imoveis(id) {
    fetch(`http//localhost:3000/imoveis/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();

            } else {
                console.log('ERRO!');
            }
        })
        .then(dados => {
            if (dados.length === 0) {
                console.log('ERRO!');
            }else{
                console.log(dados);
            }
        })
}
