let id = 1;

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
        .then(imoveis => {
            if (imoveis.length === 0) {
                document.querySelector("#no_imoveis").classList.remove("d-none");
                //console.log('Ops! Não foram encontrados imóveis :(');
            } else {
                document.querySelector("#no_imoveis").innerHTML = null;

                imoveis.forEach(imovel => {

                    let html = `<div class="popular__card">
                    <a href="imovelItem.html">
                        <img src="imagens/casa2.jpg" alt="popular hotel" />
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
                                <h3>R$800.00</h3>
                            </div>
                            <p>Campo Mourão - PR</p>
                        </div>
                    </a>

                </div>`;

                    let new__imovel = document.createElement('div');
                    new__imovel.classList.add('popular__card');
                    new__imovel.innerHTML = html;

                    document.querySelector("#popular__grid").appendChild(new__imovel);


                });

                document.querySelector("#no_imoveis").appendChild("d-none");

            }
        })
}
