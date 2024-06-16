let id = 2;

window.onload = () => {
    get_username(id);
    get_imoveis(id);
}
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

/* --------------------------------------------- MOSTRA ANUNCIOS DOS IMÓVEIS NA TELA ----------------------------------------------------- */
function get_imoveis(id) {
    fetch(`http://localhost:8000/imoveis/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('erro')
            }
        })
        .then(imoveis => {
            if (imoveis.length === 0) {
                document.querySelector("#no_imoveis").classList.remove("d-none")
            } else {
                document.querySelector("#anuncios").innerHTML = null;

                imoveis.forEach(imovel => {
                    let html = `
            <a href="imovelItem.html?id=${imovel.id}">
                <img src="imagens/${imovel.image_url}" alt="popular hotel" />
                <div class="stars">
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star'></i>
                    <i class='bx bxs-star-half'></i>
                </div>
                <div class="popular__content">
                    <div class="popular__card__header">
                        <h4>${imovel.titulo}</h4>
                        <h3>R$ ${imovel.valor}</h3>
                    </div>
                    <p>${imovel.endereco}</p>
                </div>
            </a>`;

                    let new_anuncio = document.createElement('div');
                    new_anuncio.classList.add('popular__card')
                    new_anuncio.innerHTML = html;

                    document.querySelector("#anuncios").appendChild(new_anuncio);
                   
                });
                //document.querySelector("#no_imoveis").classList.add("d-none");
            }

        })
}