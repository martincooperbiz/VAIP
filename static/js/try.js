window.addEventListener("DOMContentLoaded", function () {
    // Get the infoModal element
    const infoModal = document.getElementById('info-modal');
    const chatModal = document.getElementById('chat-modal');
    const chatDiv = document.getElementById('chat');
    const chatInfoDiv = document.getElementById('modal-chat-info');
    const patientInfoDiv = document.getElementById('modal-patient-info');

    // Get the button that opens the infoModal
    const openModalBtn = document.getElementById('openModalBtn');
    const openChatModalBtn = document.getElementById('openChatModalBtn');

    // Get the <span> element that closes the infoModal
    const closeBtn = document.getElementsByClassName('close')[0];
    const closeBtn2 = document.getElementsByClassName('close')[1];

    // Function to open the infoModal
    function openModal() {
        infoModal.style.display = 'block';
    }

    // Function to open the infoModal
    function openChatModal() {
        chatModal.style.display = 'block';
        // chatDiv.style.display = 'block';
    }

    // Function to close the infoModal
    function closeModal() {
        infoModal.style.display = 'none';
        chatModal.style.display = 'none';
    }

    // Event listener for the open button
    openModalBtn.addEventListener('click', openModal);

    // Event listener for the open button
    openChatModalBtn.addEventListener('click', openChatModal);

    // Event listener for the close button
    closeBtn.addEventListener('click', closeModal);
    closeBtn2.addEventListener('click', closeModal);


    // Function to show/hide the chat div based on screen width
    function toggleChatView() {
        const chatDiv = document.getElementById('chat');
        const chatModal = document.getElementById('chat-modal');
        var patientInfo = document.getElementById('patient-info');
        var btns = document.getElementsByClassName('btns')

        if (window.innerWidth <= 700) {

            btns[0].style.display = 'flex'
            btns[1].style.display = 'flex'

            chatDiv.className = "chat chat-content"
            // chatDiv.style.display = 'none';
            patientInfoDiv.appendChild(patientInfo)
            chatInfoDiv.innerHTML = ""
            chatInfoDiv.className = "modal-info"
            chatInfoDiv.appendChild(chatDiv)
            // chatModal.style.display = 'block';
        } else {
            btns[0].style.display = 'none'
            btns[1].style.display = 'none'
            document.getElementsByClassName("model__div")[0].appendChild(patientInfo)
            document.getElementsByClassName("model__div")[0].appendChild(chatDiv)
            chatDiv.classList = ["chat"]
            // chatDiv.style.display = 'none';
            chatModal.style.display = 'none';
        }
        console.log('resizing....', chatDiv.className)
    }

    // Call the toggleChatView function on window load and resize
    window.addEventListener('resize', toggleChatView);
    toggleChatView();


    // Event listener for the chat modal button
    document.getElementById('openChatModalBtn').addEventListener('click', function () {
        const chatModal = document.getElementById('chat-modal');
        chatModal.style.display = 'block';
    });

    // Event listener for the close button in the chat modal
    const closeButton = document.querySelector('.chat-modal-button .close');
    // closeButton.addEventListener('click', function () {
    //     const chatModal = document.getElementById('chat-modal');
    //     chatModal.style.display = 'none';
    // });

    // Event listener for clicking outside the modal content to close it
    window.addEventListener('click', function (event) {
        const chatModal = document.getElementById('chat-modal');
        if (event.target === chatModal) {
            chatModal.style.display = 'none';
        }
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });


    // // // // // // // // //

})