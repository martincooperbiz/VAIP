window.addEventListener("DOMContentLoaded", function () {

    var passwordInput = document.getElementById("passwordInput");
    var errorMessage = document.getElementById("errorMessage");
    var usernameInput = document.getElementById("usernameInput");

    var loaderDiv = document.getElementById('loader-line-div');


    loaderDiv.style.display = "none"
    function validatePassword() {

        var username = usernameInput.value;
        var password = passwordInput.value;
        // loaderDiv.style.display = "block"

        errorMessage.innerHTML = ""
        if (username.length < 8) {
            usernameInput.setCustomValidity("Username must be at least 8 characters long or a valid email address");
        } else {
            usernameInput.setCustomValidity("");
            if (password.length < 8) {
                passwordInput.setCustomValidity("Password must be at least 8 characters long");
            } else {
                // valid inputs here
                passwordInput.setCustomValidity("");
                loaderDiv.style.display = "block"
            }
        }

        
    }

    function showPassword(e) {
        e.preventDefault();

        const passwordInput = document.getElementById("passwordInput");
        const type = passwordInput.getAttribute("type");
        const eyeIcon = document.getElementById("visibility_off");
        const eyeOffIcon = document.getElementById("visibility");

        if (type === "password") {
            passwordInput.setAttribute("type", "text");
            eyeIcon.style.display = "block"
            eyeOffIcon.style.display = "none"
        } else {
            passwordInput.setAttribute("type", "password");
            eyeIcon.style.display = "none"
            eyeOffIcon.style.display = "block"
        }

    }

    document.getElementById("submitLoginButton").addEventListener("click", function (event) {
        validatePassword()
    })
    document.getElementById("showPasswordButton").addEventListener("click", function (event) {
        showPassword(event)
    })
})