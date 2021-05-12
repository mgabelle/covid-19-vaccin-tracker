const CENTRE_FINISTERE_LINK = "https://vitemadose.gitlab.io/vitemadose/29.json";
const data = document.getElementById('data');
const error = document.getElementById('error');
const refresh_button = document.getElementById('refresh-button');

const centre_infos = [
    "nom",
    "url"
]

const dates = [
    "1_days",
    "2_days",
    "chronodose",
]

const adapted_vaccines = [
    "Pfizer-BioNTech",
    "Moderna"
]

function formatCentre(centre) {
    let result = "";
    for(let key of centre_infos) {
        result += `${key} : ${JSON.stringify(centre[key])} \n`;
    }
    let rdv = "Rendez-vous -->\n"
    centre?.appointment_schedules
        .filter(appointment => dates.indexOf(appointment.name) > -1)
        .forEach(appointment => {
            rdv += `-${appointment.name} : ${appointment.total}\n`;
        });
    result += rdv;
    return result + "\n\n";
}

function hasAdaptedVaccine(centre) {
    let condition = false;
    adapted_vaccines.forEach(type => {
        if(!condition) {
            condition = (centre?.vaccine_type?.indexOf(type)) > -1;
        }
    })
    return condition;
}

function refreshData() {
    console.log('launch refresh data')
    fetch(CENTRE_FINISTERE_LINK)
        .then(res => res.json())
        .then(object => object['centres_disponibles'])
        .then(centres_disponibles => {
            data.textContent = centres_disponibles
                .filter(centre => hasAdaptedVaccine(centre))
                .map(centre => formatCentre(centre))
                .join("");
        })
        .catch(err => {
            console.warn(err);
            error.textContent = JSON.stringify(err);
        })
}

refresh_button.addEventListener('click', () => {
    location.reload();
});

refreshData();