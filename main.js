class WeatherCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .weather-card {
                    background-color: var(--card-color, #1E1E1E);
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 10px rgba(187, 134, 252, 0.2);
                    border: 1px solid var(--primary-color, #BB86FC);
                }
                .weather-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                    text-align: left;
                }
                .weather-item h3 {
                    font-size: 1.2rem;
                    color: var(--secondary-color, #03DAC6);
                    margin-bottom: 0.5rem;
                }
                .weather-item p {
                    font-size: 1.5rem;
                    margin: 0;
                }
            </style>
            <div class="weather-card">
                <div class="weather-grid" id="weather-data">
                    <div class="weather-item">
                        <h3>현재상태</h3>
                        <p id="current-condition">-</p>
                    </div>
                    <div class="weather-item">
                        <h3>온도</h3>
                        <p id="temp-c">-</p>
                    </div>
                    <div class="weather-item">
                        <h3>체감온도</h3>
                        <p id="feels-like-c">-</p>
                    </div>
                    <div class="weather-item">
                        <h3>풍속</h3>
                        <p id="wind-speed">-</p>
                    </div>
                    <div class="weather-item">
                        <h3>습도</h3>
                        <p id="humidity">-</p>
                    </div>
                </div>
            </div>
        `;
    }

    updateContent(data) {
        if (!data || !data.current_condition) return;
        const weather = data.current_condition[0];
        const weatherDataContainer = this.shadowRoot.getElementById('weather-data');
        
        weatherDataContainer.querySelector('#current-condition').textContent = weather.weatherDesc[0].value;
        weatherDataContainer.querySelector('#temp-c').textContent = `${weather.temp_C}°C`;
        weatherDataContainer.querySelector('#feels-like-c').textContent = `${weather.FeelsLikeC}°C`;
        weatherDataContainer.querySelector('#wind-speed').textContent = `${weather.windspeedKmph} km/h`;
        weatherDataContainer.querySelector('#humidity').textContent = `${weather.humidity}%`;
    }
}

customElements.define('weather-card', WeatherCard);

const citySelect = document.getElementById('city-select');
const detailsButton = document.getElementById('details-button');
const lastUpdated = document.getElementById('last-updated');
const weatherCard = document.querySelector('weather-card');

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function updateWeather() {
    const selectedCity = citySelect.value;
    const data = await fetchWeatherData(selectedCity);
    if (data) {
        weatherCard.updateContent(data);
        lastUpdated.textContent = `정보 업데이트: ${new Date().toLocaleString()}`;
    }
}

citySelect.addEventListener('change', updateWeather);

detailsButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    window.open(`https://wttr.in/${selectedCity}`, '_blank');
});

// Initial weather update for the default city
updateWeather();
