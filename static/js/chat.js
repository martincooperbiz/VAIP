

window.addEventListener('load', function () {
    var messagesDiv = document.querySelector('.messages');
    // var messages = document.querySelector('.messages-content');
    var chatDiv = this.document.getElementById("chat")
    var d, h, m;
    var i = 0;
    var messagesHistory = []



    function updateScrollbar() {
        messagesDiv.scrollTo({
            top: messagesDiv.scrollHeight,
            behavior: 'smooth'
        });
    }

    setTimeout(function () {
        responseMessage(true);
    }, 100);

    function setDate() {
        d = new Date();
        // if (m !== d.getMinutes()) {
        m = d.getMinutes();
        var timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.innerText = d.getHours() + ':' + m;
        document.querySelector('.message:last-child').appendChild(timestamp);
        // }
    }

    function insertMessage() {
        var msg = document.querySelector('.message-input').value;
        if (msg.trim() === '') {
            return false;
        }
        var message = document.createElement('div');
        message.className = 'message message-personal';
        message.innerText = msg;
        // document.querySelector('.mCSB_container').appendChild(message).classList.add('new');
        document.querySelector('.messages').appendChild(message).classList.add('new');
        setDate();
        document.querySelector('.message-input').value = '';
        updateScrollbar();
        var mm = { "role": "user", "content": msg }
        messagesHistory.push(mm)

        // responseMessage(true)
        responseMessage(false, messagesHistory.slice(1, messagesHistory.length))
    }

    document.getElementById('generate-button').addEventListener('click', function () {

        // Remove all child elements
        while (messagesDiv.firstChild) {
            messagesDiv.removeChild(messagesDiv.firstChild);
        }

        // clear messages history
        messagesHistory = [];
        responseMessage(true);
        // console.log("clear event", messagesHistory.length)
    });

    // document.getElementById('message-submit2').addEventListener('click', function () {
    //     insertMessage();
    //     console.log('clicked message-submit')
    // });

    document.getElementById('message-submit').addEventListener('click', function () {
        insertMessage();
        // console.log('clicked message-submit')
    });

    window.addEventListener('keydown', function (e) {
        if (e.which === 13) {
            insertMessage();
            return false;
        }
    });

    var Fake = [
        'Hi, i am your virtual AI patient please help me detect my disease ',
        // 'please enter the stock you\'d like to predict<input type="text" class="form-control oracle-search" name="query"  placeholder="Start typing something to search..."> ',
        'Please help me detect and treat my disease',
        // 'good.....What is your comfortable level for investment loss (in %) <input type="range" value="50" min="0" max="100" step="10" />',
        // 'we are Predicting... <div class="loading-img"><img src="/static/img/loader.gif"  alt=""/></div>',
        // 'great.. do you want to predict another? <button class="buttonx sound-on-click">Yes</button> <button class="buttony sound-on-click">No</button> ',
        // 'Bye',
        // ':)'
        "I've been having frequent headaches and I'm not sure why.",
        "Lately, I've been feeling nauseous and I don't know the cause.",
        "I've noticed a rash on my skin, but I'm unsure what it is.",
        "I've been experiencing shortness of breath and it's concerning me.",
        "I've been having trouble sleeping and I'm not sure why.",
        "I've been feeling dizzy and lightheaded, but I don't know why.",
        "I've noticed a persistent cough that won't go away.",
        "I've been having digestive issues and I'm unsure of the cause.",
        "I've been experiencing joint pain and I'm not sure what's causing it.",
        "Lately, I've been feeling extremely fatigued and it's worrying me.",
        "I've been having difficulty concentrating and it's affecting my work.",
        "I've noticed changes in my vision and I'm not sure why.",
        "I've been experiencing frequent urination and it's bothering me.",
        "I've been feeling anxious and overwhelmed, but I don't know why.",
        "I've been having unexplained weight loss and it's concerning me."
    ];

    async function chat(messages) {
        try {
            const lastMessage = messages[messages.length - 1];
            // Google analytics event
            gtag('event', 'chat_vaip', {
                "event_name":'chat_vaip',
                "message": lastMessage
            });
            var patientInfoElement = document.getElementById("patient_info_data");
            var jsonPatientData = patientInfoElement.textContent;
            var patientData = JSON.parse(jsonPatientData);

            var diseaseInfoElement = document.getElementById("disease_info_data");
            var jsonDiseaseData = diseaseInfoElement.textContent;
            var diseaseData = JSON.parse(jsonDiseaseData);

            var patient_info
            const data = {
                messages: messages,
                patient_info: patientData,
                disease: diseaseData
            };

            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            // console.log('Result', result);
            return { answer: result.answer };
        } catch (error) {
            console.error('Error making chat POST request:', error);
            return { answer: "I couldn't get you., there is error check console!" };
        }
    }

    function updateResponseMessage(text) {

        document.querySelector('.message.loading').remove();
        var newMessage = document.createElement('div');
        newMessage.className = 'message new';
        newMessage.style.backgroundColor = "rgba(44, 44, 44, 0.3)";
        var newAvatar = document.createElement('figure');
        newAvatar.className = 'avatar';
        var newImg = document.createElement('img');
        newImg.src = '/static/img/loader.gif';
        newAvatar.appendChild(newImg);
        newMessage.appendChild(newAvatar);
        newMessage.innerHTML = text;
        document.querySelector('.messages').appendChild(newMessage).classList.add('new');
        setDate();
        i++;
        updateScrollbar();
    }

    async function responseMessage(fake, messages) {
        if (document.querySelector('.message-input').value !== '') {
            return false;
        }
        var loadingMessage = document.createElement('div');
        loadingMessage.className = 'message loading new';
        var avatar = document.createElement('figure');
        avatar.className = 'avatar';
        var img = document.createElement('img');
        img.src = '/static/img/loader.gif';
        avatar.appendChild(img);
        loadingMessage.appendChild(avatar);
        var span = document.createElement('span');
        loadingMessage.appendChild(span);
        document.querySelector('.messages').appendChild(loadingMessage);

        updateScrollbar()


        var botAnswer = Fake[i]
        if (!fake) {
            try {
                const response = await chat(messages);
                // console.log(response)
                // return ""
                const { answer } = response;
                // console.log('answer', answer);
                botAnswer = answer
            } catch (error) {
                botAnswer = "error occured, check concole! "
                console.error('An error occurred:', error);
            }



        }



        var mm = { "role": "assistant", "content": botAnswer }
        messagesHistory.push(mm)
        // console.info(messagesHistory)

        updateResponseMessage(botAnswer)



    }

});