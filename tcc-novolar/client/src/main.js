let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('active');

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

