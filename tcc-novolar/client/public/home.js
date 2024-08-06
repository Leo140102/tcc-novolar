let id = 2;

window.onload = () => {
    get_username(id);
    get_imoveisMaiorNotas();
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
function get_imoveisMaiorNotas() {
    fetch(`http://localhost:8000/bemAvaliados`)
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
                console.log(imoveis);
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
            <span id = "nota"> 4.7</span>
          </div>
          <div class="popular__content">
            <div class="popular__card__header">
              <h4>${imovel.titulo}</h4>
              <h3>R$${imovel.valor}</h3>
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

document.querySelector('#searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        const searchTerm = this.value;
        get_imoveisPesquisa(searchTerm);
    }
});

function get_imoveisPesquisa(searchTerm) {
    // Construa a URL com o termo de pesquisa
    const url = `http://localhost:8000/pesquisa?query=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('Erro ao buscar imóveis');
            }
        })
        .then(imoveis => {
            if (imoveis.length === 0) {
                document.querySelector("#no_imoveis").classList.remove("d-none");
            } else {
                console.log(imoveis);
                document.querySelector("#anuncios").innerHTML = null;

                imoveis.forEach(imovel => {
                    let html = `
                        <a href="imovelItem.html?id=${imovel.id}">
                            <img src="imagens/${imovel.image_url}" alt="Popular Hotel" />
                            <div class="stars">
                                <i class='bx bxs-star'></i>
                                <i class='bx bxs-star'></i>
                                <i class='bx bxs-star'></i>
                                <i class='bx bxs-star'></i>
                                <i class='bx bxs-star-half'></i>
                                <span id="nota">4.7</span>
                            </div>
                            <div class="popular__content">
                                <div class="popular__card__header">
                                    <h4>${imovel.titulo}</h4>
                                    <h3>R$${imovel.valor}</h3>
                                </div>
                                <p>${imovel.endereco}</p>
                            </div>
                        </a>`;
                    
                    let newAnuncio = document.createElement('div');
                    newAnuncio.classList.add('popular__card');
                    newAnuncio.innerHTML = html;

                    document.querySelector("#anuncios").appendChild(newAnuncio);
                });
                // Ocultar mensagem de não há imóveis disponíveis
                document.querySelector("#no_imoveis").classList.add("d-none");
            }
        })
        .catch(error => {
            console.error('Erro ao buscar imóveis:', error);
        });
}


//pesquisar
const searchToggle = document.querySelector(".searchToggle");

searchToggle.addEventListener("click", () => {
    const searchIcon = document.querySelector(".search");
    const cancelIcon = document.querySelector(".cancel");
    searchToggle.classList.toggle("active");
    if (searchIcon.style.display === "none") {
        searchIcon.style.display = "block";
        cancelIcon.style.display = "none";
    } else {
        searchIcon.style.display = "none";
        cancelIcon.style.display = "block";
    }
});

//perfil
let profileDropdownList = document.querySelector(".profile-dropdown-list");
let btn = document.querySelector(".profile-dropdown-btn");

let classList = profileDropdownList.classList;

const toggle = () => classList.toggle("active");

window.addEventListener("click", function (e) {
    if (!btn.contains(e.target)) classList.remove("active");
});
