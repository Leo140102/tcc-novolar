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
                // console.log(id);
                const imovel = imoveis[0]
                // console.log(imovel);
                document.querySelector("#anunciosItem > h2").textContent = imovel.titulo;
                // console.log(imovel.titulo);
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
    fetch(`http://localhost:8000/imovelImgs/${id}`)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log("entra erro?");
            }
        })
        .then(imoveis => {
            if (imoveis.length === 0) {
                document.querySelector("#no_imoveis").classList.remove("d-none")
            } else {
                document.querySelector("#imgs").innerHTML = null;
                document.querySelector("#rolagem").innerHTML = null;

                imoveis.forEach(imovel => {
                    let html = ``;

                    let new_imgs = document.createElement('img');
                    new_imgs.classList.add('imagens')
                    new_imgs.src=`imagens/${imovel.image_url}`
                    new_imgs.alt="casa aluguel"
                    // new_imgs.style="transform: translateX(-538px)";
                    new_imgs.innerHTML = html;

                    document.querySelector("#imgs").appendChild(new_imgs);
                    //document.querySelector("#imgs").style = "transform: translateX(-538px)";
                    console.log(imovel.image_url);

                });

                imoveis.forEach((imovel, index) => {
                    let html = `
                        <a data-id="${index + 1}">
                            <img src="imagens/${imovel.image_url}" alt="imagem casa">
                        </a>`;
                    console.log(index + 1);
                    let new_imgs = document.createElement('div');
                    new_imgs.classList.add('img-item')
                    new_imgs.innerHTML = html;

                    document.querySelector("#rolagem").appendChild(new_imgs);


                });
                // const principal = imoveis[0];
                // document.querySelector("#imgs").src = `imagens/${principal.image_url}`;


            }



        })
}