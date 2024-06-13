const login_btn = document.querySelector("#login-btn");
const cadastro_btn = document.querySelector("#cadastro-btn");
const container = document.querySelector(".container");

const login_btn2 = document.querySelector("#login-btn2");
const cadastro_btn2 = document.querySelector("#cadastro-btn2");

const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value === "") {
    parent.classList.remove("focus");
  }

}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

cadastro_btn.addEventListener("click", () => {
  container.classList.add("cadastro-mode");
});

login_btn.addEventListener("click", () => {
  container.classList.remove("cadastro-mode");
});

cadastro_btn2.addEventListener("click", () => {
  container.classList.add("cadastro-mode2");
});

login_btn2.addEventListener("click", () => {
  container.classList.remove("cadastro-mode2");
});
