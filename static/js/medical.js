const upper = (str) => str.charAt(0).toUpperCase() + str.slice(1);

async function generate() {
    var loaderDiv = document.getElementById('loader-line-div');
    var genButton = document.getElementById('generate-button');
    loaderDiv.style.display = "flex"

    clearHotspots()
    clearPatient()
    clearSymptoms()


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
            console.log('Result', result)
            updateHotspots(result.hotspots)
            updatePatient(result.patient)
            loaderDiv.style.display = "none"
        })
        .catch(error => {
            // Handle any errors
            loaderDiv.style.display = "none"
            alert(`Error making POST request:\n${error}`)
            console.error('Error making POST request:', error);
        })
        .finally(() => {

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

function updatePatient(patient) {
    var patientInfo = document.getElementById('patient-info');
    patientInfo.style.display = "block"

    // Update the content of the elements
    document.getElementById('patient-age').textContent = patient["age"];
    document.getElementById('patient-nationality').textContent = patient["nationality"];
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