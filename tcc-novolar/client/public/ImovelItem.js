const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
    imgItem.addEventListener('click', (event) => {
        event.preventDefault();
        imgId = imgItem.dataset.id;
        slideImage();

    });
});

function slideImage() {
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

/* --------------------------------------------- MOSTRA ANUNCIOS DOS IMÓVEIS NA TELA ----------------------------------------------------- */

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

window.onload = () => {
    get_infoImovel("");
    get_infoImovel(id);
    get_imovelImgs(id);
}

function get_infoImovel(id) {
    console.log(id);
    fetch(`http://localhost:8000/imovelItem/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('erro');
            }
        })
        .then(imoveis => {
            if (imoveis.length === 0) {
                document.querySelector("#no_imoveis").classList.remove("d-none");
            } else {
                console.log(id);
                const imovel = imoveis[0]
                console.log(imovel);
                document.querySelector("#anunciosItem > h2").textContent = imovel.titulo;
                console.log(imovel.titulo);
                document.querySelector("#anunciosItem > div > h3 > span").textContent = imovel.valor;
                document.querySelector("#anunciosItem  > div >  p").textContent = imovel.descricao;
                document.querySelector("#anunciosItem > div > a").href = `https://wa.me/${imovel.telefone}`;
                document.querySelector("#anunciosItem > div > ul").href = `https://wa.me/${imovel.telefone}`;

                document.querySelector('#sexo').textContent = imovel.sexo;
                document.querySelector('#idade').textContent = imovel.idade;
                document.querySelector('#animais').textContent = imovel.animais;
                document.querySelector('#fumarBebidas').textContent = imovel.fumar;

                document.querySelector("#endereco").textContent = imovel.endereco;
            }
        });
}

function get_imovelImgs(id) {
    fetch(`http://localhost:8000/imoimovelImgsveis/${id}`)
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

            }

        })
}