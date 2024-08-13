window.onload = () => {
    checkUserSession();

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