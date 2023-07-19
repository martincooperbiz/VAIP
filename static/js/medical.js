// import * as chat from './chat.js';

const upper = (str) => str.charAt(0).toUpperCase() + str.slice(1);
async function generate() {
    // Google analytics event
    gtag('event', 'generate_vaip', {
        "event_name": 'generate_vaip',
    });
    var loaderDiv = document.getElementById('loader-line-div');
    var genButton = document.getElementById('generate-button');
    loaderDiv.style.display = "flex"
    var chatDiv = this.document.getElementById("chat")

    // var patientInfo = document.getElementById('patient-info');
    var btns = document.getElementsByClassName('btns')
    btns[0].style.display = 'none'
    btns[1].style.display = 'none'

    function hideChat() {
        chatDiv.style.display = "none"
    }
    function showChat() {
        chatDiv.style.display = "flex"
    }
    function updateDate() {
        d = new Date();
        // if (m !== d.getMinutes()) {
        m = d.getMinutes();
        var timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.innerText = d.getHours() + ':' + m;
        document.querySelector('.message:last-child').appendChild(timestamp);
        // }
    }
    clearHotspots()
    clearPatient()
    clearSymptoms()
    hideChat()


    // Disable the button
    genButton.disabled = true;

    // Change the button title
    const annotation = genButton.querySelector('.HotspotAnnotation');
    annotation.textContent = 'Generating...';


    // setTimeout(() => {
    //     loaderDiv.style.display = "none"

    // }, 1000);
    // return
    // Make a POST request
    var data = {
        position: "hotspotPosition",
        hotspotId: "hotspot.id"
    };

    fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            // console.log('Result', result)
            updateHotspots(result.hotspots)
            updatePatient(result.patient, result.disease)
            showChat()
            updateDate()
            if (window.innerWidth <= 700) {

                // var btns = document.getElementsByClassName('btns')
                btns[0].style.display = 'flex'
                btns[1].style.display = 'flex'

            }
        })
        .catch(error => {
            // Handle any errors
            alert(`let's give it another try `)
            // alert(`Error making POST request:\n${error}`)
            console.error('Error making generate POST request:', error);
        })
        .finally(() => {
            loaderDiv.style.display = "none"

            // Enable the button
            genButton.disabled = false;
            // clearPatient()

            // Restore the original button title
            annotation.textContent = 'Generate a VAIP';
        });

}

function clearSymptoms() {
    var detailsDiv = document.getElementById('symptom-info');
    detailsDiv.style.display = "none"
}

function handleHotspotClick(element, hotspot) {
    updateSymptoms(hotspot)
}

function updateSymptoms(hotspot) {
    // console.log(hotspot)
    var symptomInfo = document.getElementById('symptom-info');
    // Remove the initial symptom info container
    // symptomInfo.parentNode.removeChild(symptomInfo);
    symptomInfo.style.display = `block`


    // Clear previous content
    symptomInfo.innerHTML = '';

    // Loop through the symptomData array and create HTML elements dynamically
    const symptomTitle = document.createElement('h3');
    symptomTitle.className = 'title';
    symptomTitle.textContent = upper(hotspot.text);
    symptomInfo.appendChild(symptomTitle);

    hotspot.symptoms.forEach((item, index) => {
        const symptomSubtitle = document.createElement('h4');
        symptomSubtitle.className = 'title';
        symptomSubtitle.textContent = upper(item.symptom);
        symptomInfo.appendChild(symptomSubtitle);

        const symptomDetails = document.createElement('h5');
        symptomDetails.className = 'symptom-details';
        symptomDetails.textContent = upper(item['symptom-description']);
        symptomInfo.appendChild(symptomDetails);
    });
}

function clearPatient() {
    var patientInfo = document.getElementById('patient-info');
    patientInfo.style.display = "none"
}

function updatePatient(patient, disease) {

    var patientInfoElement = document.getElementById("patient_info_data");
    patientInfoElement.textContent = JSON.stringify(patient);


    var diseaseInfoElement = document.getElementById("disease_info_data");
    diseaseInfoElement.textContent = JSON.stringify(disease);

    var patientInfo = document.getElementById('patient-info');
    // if (window.innerWidth <= 700) {
    //     // document.getElementsByClassName('btns').forEach(ele => ele.style.display = "block")
    // } else {
    //     // document.getElementsByClassName('btns').forEach(ele => { ele.style.display = "none" })
    patientInfo.style.display = "block"
    // }
    // Update the content of the elements
    document.getElementById('patient-age').textContent = patient["age"];
    document.getElementById('patient-nationality').textContent = patient["nationality"];
    document.getElementById('patient-chat-name').textContent = `${patient["name"]}, ${patient["age"]} years old, ${patient["sex"]}`;
    document.getElementById('patient-name').textContent = patient["name"];
    document.getElementById('patient-sex').textContent = patient["sex"];
    document.getElementById('patient-professional').textContent = patient["professional"];
    document.getElementById('patient-medical-history').textContent = patient["medical-history"];
    document.getElementById('chief-complaint-content').textContent = patient["chief-complaint"];
}

function clearHotspots() {
    // Get the model viewer element
    var modelViewer = document.querySelector('model-viewer');

    // Get all the hotspot buttons
    var hotspotButtons = modelViewer.querySelectorAll('.Hotspot');

    // Remove each hotspot button
    // Remove hotspot buttons from index 1 to end
    for (var i = 1; i < hotspotButtons.length; i++) {
        hotspotButtons[i].remove();
    }
}

function updateHotspots(hotspots) {
    // Get the model viewer element
    var modelViewer = document.querySelector('model-viewer');

    // Get all the hotspot buttons
    var hotspotButtons = modelViewer.querySelectorAll('.Hotspot');

    clearHotspots()

    hotspots.map(hotspot => {


        // Create a new hotspot button
        var newHotspotButton = document.createElement('button');
        newHotspotButton.classList.add('Hotspot');
        newHotspotButton.setAttribute('slot', hotspot.id);
        newHotspotButton.setAttribute('data-position', hotspot['data-position']);
        newHotspotButton.setAttribute('data-normal', hotspot['data-normal']);
        newHotspotButton.setAttribute('data-visibility-attribute', 'visible');
        newHotspotButton.onclick = function () {
            handleHotspotClick(this, hotspot);
        };

        // Create the hotspot annotation
        var newHotspotAnnotation = document.createElement('div');
        newHotspotAnnotation.classList.add('HotspotAnnotation');
        newHotspotAnnotation.textContent = hotspot.text;

        // Append the annotation to the hotspot button
        newHotspotButton.appendChild(newHotspotAnnotation);

        // Append the hotspot button to the model viewer
        modelViewer.appendChild(newHotspotButton);


    })
}