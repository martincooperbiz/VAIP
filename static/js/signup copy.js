window.addEventListener("DOMContentLoaded", function () {

    var passwordInput = document.getElementById("passwordInput");
    var errorMessage = document.getElementById("errorMessage");
    var usernameInput = document.getElementById("usernameInput");

    var loaderDiv = document.getElementById('loader-line-div');
    loaderDiv.style.display = "none"

    // 

    var usernameInput = document.forms["signupForm"]["username"];
    var emailInput = document.forms["signupForm"]["email"];
    var passwordInput = document.forms["signupForm"]["password"];
    var confirmPasswordInput = document.forms["signupForm"]["confirm_password"];


    // 

    // Function to validate the form
    // function validateForm() {

    //     // Reset custom validity for all input fields
    //     usernameInput.setCustomValidity("");
    //     emailInput.setCustomValidity("");
    //     passwordInput.setCustomValidity("");
    //     confirmPasswordInput.setCustomValidity("");

    //     // Username validation
    //     if (usernameInput.value.length < 8) {
    //         usernameInput.setCustomValidity("Username must be at least 8 characters long.");
    //         return false;
    //     }

    //     // Email validation
    //     var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(emailInput.value)) {
    //         emailInput.setCustomValidity("Please enter a valid email address.");
    //         return false;
    //     }

    //     // Password validation
    //     if (passwordInput.value.length < 8) {
    //         passwordInput.setCustomValidity("Password must be at least 8 characters long.");
    //         return false;
    //     }

    //     // Confirm Password validation
    //     if (passwordInput.value !== confirmPasswordInput.value) {
    //         confirmPasswordInput.setCustomValidity("Passwords do not match.");
    //         return false;
    //     }

    //     return true; // Form is valid
    // }

    function validateForm() {
        
        var errorElement = document.getElementById("errorMessage");
        errorElement.textContent = ""
        // var errorMessages = document.getElementsByClassName("error-message");
        // for (var i = 0; i < errorMessages.length; i++) {
        //     errorMessages[i].textContent = ""; // Clear existing error messages
        // }
    
        var isValid = true;
        console.log("usernameInput.value.length < 8", usernameInput.value.length < 8)
        // Username validation
        if (usernameInput.value.length < 8) {
            showError(usernameInput, "Username must be at least 8 characters long.");
            isValid = false;
            return isValid
        }
    
        // Email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, "Please enter a valid email address.");
            isValid = false;
            return isValid
        }
    
        // Password validation
        if (passwordInput.value.length < 8) {
            showError(passwordInput, "Password must be at least 8 characters long.");
            isValid = false;
            return isValid
        }
    
        // Confirm Password validation
        if (passwordInput.value !== confirmPasswordInput.value) {
            showError(passwordInput, "Passwords do not match.");
            isValid = false;
            return isValid
        }
    
        return isValid; // Form is valid
    }
    
    function showError(inputElement, errorMessage) {
        // var errorElement = inputElement.parentElement.querySelector(".error-message");
        // var errorElement = document.querySelector(".error-message");
        var errorElement = document.getElementById("errorMessage");
        errorElement.textContent = errorMessage;
        setTimeout(() => {
            errorElement.textContent = "";
        }, 1000);
    }
    



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

    document.getElementById("submitSignupButton").addEventListener("click", function(event) {
        console.log('usernameInput', usernameInput.value)
        event.preventDefault(); // Prevent form submission

        if (validateForm()) {
            // Validation successful, proceed with form submission
            this.submit();
        }
    });
    // document.getElementById("signupForm").addEventListener("submit", function(){
    //     return validateForm()
    // })

    // document.getElementById("signupForm").addEventListener("submit", function (event) {
    //     event.preventDefault(); // Prevent form submission
    //     console.log('usernameInput', usernameInput.value)

    //     if (validateForm()) {
    //         // Validation successful, proceed with form submission
    //         this.submit();
    //     }
    // });
    document.getElementById("showPasswordButton").addEventListener("click", function (event) {
        // validatePassword()
        showPassword(event)
    })
})