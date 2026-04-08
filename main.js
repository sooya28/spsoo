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
                    background-color: var(--card-bg, rgba(30, 30, 30, 0.7));
                    backdrop-filter: blur(10px);
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
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

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

const weatherBackgrounds = {
    'Sunny': 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1920&q=80',
    'Clear': 'https://images.unsplash.com/photo-1510562339992-1237e1e47962?auto=format&fit=crop&w=1920&q=80',
    'Partly cloudy': 'https://images.unsplash.com/photo-1595841055318-50269399436d?auto=format&fit=crop&w=1920&q=80',
    'Cloudy': 'https://images.unsplash.com/photo-1534088568595-a066f710b721?auto=format&fit=crop&w=1920&q=80',
    'Overcast': 'https://images.unsplash.com/photo-1483977399921-6cf94f6fdc3a?auto=format&fit=crop&w=1920&q=80',
    'Rain': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1920&q=80',
    'Snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80',
    'Mist': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80',
    'Fog': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80',
    'Thundery outbreaks possible': 'https://images.unsplash.com/photo-1605727285072-4a5ef26191ec?auto=format&fit=crop&w=1920&q=80'
};

function updateBackground(condition) {
    let bgUrl = '';
    const desc = condition.toLowerCase();
    
    if (desc.includes('sun') || desc.includes('clear')) bgUrl = weatherBackgrounds['Sunny'];
    else if (desc.includes('cloudy') || desc.includes('overcast')) bgUrl = weatherBackgrounds['Cloudy'];
    else if (desc.includes('rain') || desc.includes('drizzle')) bgUrl = weatherBackgrounds['Rain'];
    else if (desc.includes('snow') || desc.includes('blizzard')) bgUrl = weatherBackgrounds['Snow'];
    else if (desc.includes('fog') || desc.includes('mist')) bgUrl = weatherBackgrounds['Fog'];
    else if (desc.includes('thunder')) bgUrl = weatherBackgrounds['Thundery outbreaks possible'];
    else bgUrl = weatherBackgrounds['Overcast'];

    document.body.style.backgroundImage = `url('${bgUrl}')`;
}

async function updateWeather() {
    const selectedCity = citySelect.value;
    const data = await fetchWeatherData(selectedCity);
    if (data) {
        const weather = data.current_condition[0];
        weatherCard.updateContent(data);
        updateBackground(weather.weatherDesc[0].value);
        lastUpdated.textContent = `정보 업데이트: ${new Date().toLocaleString()}`;
    }
}

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
    }
}

citySelect.addEventListener('change', updateWeather);

detailsButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    window.open(`https://wttr.in/${selectedCity}`, '_blank');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        setTheme('light');
        localStorage.setItem('theme', 'light');
    }
});

// Initial weather update for the default city
updateWeather();
