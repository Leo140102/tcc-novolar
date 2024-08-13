

let id = 2;

window.onload = () => {
    get_username(id);
    get_imoveis(id);
    checkUserSession();
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
                <img src="imagens/loft1.0.jpg" alt="popular hotel" />
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
// function get_imoveis(id) {
//     fetch(`http://localhost:8000/imoveis/${id}`)
//         .then(response => {
//             if (response.status === 200) {
//                 return response.json();

//             } else {
//                 console.log('ERRO!');
//             }
//         })
//         .then(imoveis => {
//             if (imoveis.length === 0) {
//                 document.querySelector("#no_imoveis").classList.remove("d-none");
//                 //console.log('Ops! Não foram encontrados imóveis :(');
//             } else {
//                 document.querySelector("#popular__grid").innerHTML = null;

//                 imoveis.forEach(imovel => {

//                     let html = `<div class="popular__card">
//                     <a href="imovelItem.html">
//                         <img src="imagens/casa2.jpg" alt="popular hotel" />
//                         <div class="stars">
//                             <i class='bx bxs-star'></i>
//                             <i class='bx bxs-star'></i>
//                             <i class='bx bxs-star'></i>
//                             <i class='bx bxs-star'></i>
//                             <i class='bx bxs-star-half'></i>
//                         </div>
//                         <div class="popular__content">
//                             <div class="popular__card__header">
//                                 <h4></h4>
//                                 <h3>R$800.00</h3>
//                             </div>
//                             <p>Campo Mourão - PR</p>
//                         </div>
//                     </a>

//                 </div>`;

//                     let new__imovel = document.createElement('div');
//                     new__imovel.classList.add('popular__card');
//                     new__imovel.innerHTML = html;

//                     document.querySelector("#popular__grid").appendChild(new__imovel);


//                 });

//                 document.querySelector("#no_imoveis").appendChild("d-none");

//             }
//         })
// }

// icone pesquisar

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

document.querySelector('#searchInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {

        const searchTerm = this.value;
        console.log(searchTerm);
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

function checkUserSession() {
    var userSessionText = document.getElementById('userSession2').innerText;
    // Verifica se o texto é "Undefined"
    if (userSessionText === "Undefined" || userSessionText === "") {
        // Esconde a div .profile-dropdown
        var profileDropdown = document.querySelector('.profile-dropdown');
        profileDropdown.style.display = 'none';
    } else {
        // Mostra a div .profile-dropdown
        var profileDropdown = document.querySelector('.profile-dropdown');
        profileDropdown.style.display = 'block';
    }
}
