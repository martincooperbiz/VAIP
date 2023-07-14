window.addEventListener("DOMContentLoaded", function () {

    // var passwordInput = document.getElementById("passwordInput");
    var errorMessage = document.getElementById("errorMessage");
    var usernameInput = document.getElementById("usernameInput");

    var loaderDiv = document.getElementById('loader-line-div');
    loaderDiv.style.display = "none"

    const form = document.getElementById('signupForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const password2 = document.getElementById('password2');
    const passwordInput = document.getElementById('passwordInput');

    //Show input error messages
    function showError(input, message) {
        var formControl = input.parentElement;
        if (getFieldName(input) == "PasswordInput") {
            var formControl = formControl.parentElement;
        }
        formControl.className = 'form-control error';
        const small = formControl.querySelector('small');
        small.style.display = "block"
        small.innerText = message;
        setTimeout(() => {
            formControl.className = 'form-control';

            small.style.display = "none"
        }, 2000);
    }

    //show success colour
    function showSucces(input) {
        var formControl = input.parentElement;
        if (getFieldName(input) == "PasswordInput") {
            var formControl = formControl.parentElement;
        }
        formControl.className = 'form-control success';
        const small = formControl.querySelector('small');
        small.style.display = "none"
    }

    //check email is valid
    function checkEmail(input) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(input.value.trim())) {
            showSucces(input)
        } else {
            showError(input, 'Email is not invalid');
        }
    }


    //checkRequired fields
    function checkRequired(inputArr) {
        inputArr.forEach(function (input) {
            if (input.value.trim() === '') {
                showError(input, `${getFieldName(input)} is required`)
            } else {
                showSucces(input);
            }
        });
    }


    //check input Length
    function checkLength(input, min, max) {
        if (input.value.length < min) {
            showError(input, `${getFieldName(input)} must be at least ${min} characters`);
        } else if (input.value.length > max) {
            showError(input, `${getFieldName(input)} must be les than ${max} characters`);
        } else {
            showSucces(input);
        }
    }

    //get FieldName
    function getFieldName(input) {
        return input.id.charAt(0).toUpperCase() + input.id.slice(1);
    }

    // check passwords match
    function checkPasswordMatch(input1, input2) {
        if (input1.value !== input2.value) {
            showError(input2, 'Passwords do not match');
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

    // Check if the form is valid
    function isFormValid() {
        const formControls = document.querySelectorAll(".form-control");
        for (let i = 0; i < formControls.length; i++) {
            if (!formControls[i].classList.contains("success")) {
                return false;
            }
        }
        return true;
    }




    //Event Listeners
    this.document.getElementById("showPasswordButton").addEventListener('click', function (e) {
        showPassword(e)
    })

    //Event Listeners
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        loaderDiv.style.display = "block"

        errorMessage.innerHTML = ""
        checkRequired([username, email, passwordInput, password2]);
        checkLength(username, 3, 15);
        checkLength(passwordInput, 6, 25);
        checkEmail(email);
        checkPasswordMatch(passwordInput, password2);

        // Check if the form is valid
        if (isFormValid()) {
            // Perform any additional actions or submit the form
            console.log("Form is valid");
            this.submit()
            // Uncomment the line below to submit the form
            // form.submit();
        } else {
            console.log("Form is not valid");
            loaderDiv.style.display = "none"
        }
    });
})