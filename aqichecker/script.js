// Get your API key from https://api.waqi.info/
const API_KEY = 'YOUR_API_KEY';

async function getAQI() {
    const city = document.getElementById('cityInput').value;
    const resultDiv = document.getElementById('result');
    const aqiCard = document.getElementById('aqiCard');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    // Show loading
    loading.classList.remove('hidden');
    aqiCard.classList.add('hidden');
    error.classList.add('hidden');

    try {
        const response = await fetch(`https://api.waqi.info/feed/${city}/?token=${API_KEY}`);
        const data = await response.json();

        if (data.status === 'ok') {
            displayResults(data.data);
        } else {
            showError('City not found or no data available');
        }
    } catch (err) {
        showError('Error fetching data. Please try again.');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(data) {
    const aqiCard = document.getElementById('aqiCard');
    const aqiValue = document.getElementById('aqiValue');
    const aqiStatus = document.getElementById('aqiStatus');
    const pollutants = document.getElementById('pollutants');

    // Display AQI
    aqiValue.textContent = data.aqi;
    
    // Set AQI status and color
    const status = getAQIStatus(data.aqi);
    aqiStatus.textContent = status.label;
    aqiStatus.className = 'aqi-status ' + status.class;

    // Display pollutants
    pollutants.innerHTML = '';
    const pollutantData = {
        pm25: data.iaqi.pm25?.v || 'N/A',
        pm10: data.iaqi.pm10?.v || 'N/A',
        o3: data.iaqi.o3?.v || 'N/A',
        no2: data.iaqi.no2?.v || 'N/A',
        so2: data.iaqi.so2?.v || 'N/A',
        co: data.iaqi.co?.v || 'N/A'
    };

    for (const [key, value] of Object.entries(pollutantData)) {
        const div = document.createElement('div');
        div.className = 'pollutant-item';
        div.innerHTML = `
            <h4>${key.toUpperCase()}</h4>
            <p>${value}</p>
        `;
        pollutants.appendChild(div);
    }

    aqiCard.classList.remove('hidden');
}

function getAQIStatus(aqi) {
    if (aqi <= 50) return { label: 'Good', class: 'good' };
    if (aqi <= 100) return { label: 'Moderate', class: 'moderate' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', class: 'unhealthy' };
    if (aqi <= 200) return { label: 'Unhealthy', class: 'unhealthy' };
    if (aqi <= 300) return { label: 'Very Unhealthy', class: 'very-unhealthy' };
    return { label: 'Hazardous', class: 'hazardous' };
}

function showError(message) {
    const error = document.getElementById('error');
    const aqiCard = document.getElementById('aqiCard');
    
    error.textContent = message;
    error.classList.remove('hidden');
    aqiCard.classList.add('hidden');
}