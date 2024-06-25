
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
                const imovel = imoveis[0]
                document.querySelector("#anunciosItem > h2").textContent = imovel.titulo;
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
                    new_imgs.src = `imagens/${imovel.image_url}`
                    new_imgs.alt = "casa aluguel"
                    new_imgs.innerHTML = html;

                    document.querySelector("#imgs").appendChild(new_imgs);
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

                    document.querySelector(".img-select").appendChild(new_imgs);



                });
                addEventListenersToImages();


            }



        })
}

//----------------------------------------------------mudar imagem animação-----------------------------------------------------------------------

let imgId = 1;
function addEventListenersToImages() {
    const imgs = document.querySelectorAll('.img-select a');
    const imgBtns = Array.from(imgs);
    

    imgBtns.forEach((imgItem) => {
        imgItem.addEventListener('click', (event) => {
            event.preventDefault();
            imgId = imgItem.dataset.id;
            console.log(imgId);
            slideImage();
            console.log();
        });
    });
}

function slideImage() {
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

    document.querySelector('.img-showcase').style.transform = `translateX(${- (imgId - 1) * displayWidth}px)`;
}

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