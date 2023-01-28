// Keys for city info API
const optionsCity = {
    method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f6557a4083msh5057db0ccd01e70p14fff0jsn7073c584d397',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};

// Keys for weather info API
const optionsWeather = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f6557a4083msh5057db0ccd01e70p14fff0jsn7073c584d397',
		'X-RapidAPI-Host': 'weatherbit-v1-mashape.p.rapidapi.com'
	}
};

// Async function that gets city ID by city name (limited to: country - South Africa; type - city) and starts after a function getAllDetailsByID
const getIdByCityName = async (cityName) => {
    try {
        let idData = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=Q258&namePrefix=${cityName}&sort=name&&types=CITY`, optionsCity);
        let idJson = await idData.json();
        let id = await idJson.data[0].id
        return getAllDetailsByID(await id)
    } catch(err) {
        alert(err);
    }
}

// Function that gets the rest of the details about the city and weather from server and outputs it to document
let getAllDetailsByID = function(id) {

    // Makes 2sec delay before next API request (to avoid server limits for free to pay users).
    let interval = setInterval(
        async() => {
            try {
                // Async function that gets city details from server by city ID.
                let cityDetail = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities/${id}`, optionsCity);
                let cityDetailJson = await cityDetail.json();
                let cityDetails = await cityDetailJson.data;
                clearInterval(interval);
                // the part of Async function that gets info about temperature by coordinates
                let currentTemperature = await fetch(`https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=${cityDetails.longitude}&lat=${cityDetails.latitude}`, optionsWeather);
                let currentTempJson = await currentTemperature.json();
                let temp = await currentTempJson.data[0].temp;
                // the part of Async function that outputs all info to document
                document.getElementById('results').innerHTML=`City name: ${cityDetails.name}; Coordinates: ${cityDetails.latitude}, ${cityDetails.longitude}; City elevation (meters): ${cityDetails.elevationMeters}; Population: ${cityDetails.population}; Current temperature:${temp} C`;
            } catch(err) {
                alert(err);
            }
        }
    , 2000);
    // Async function starter with 2 sec delay inside
    interval
}