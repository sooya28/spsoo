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
                    margin-bottom: 1rem;
                }
                .weather-card {
                    background-color: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(8px);
                    padding: 1.5rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #333;
                }
                .weather-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    text-align: center;
                }
                .weather-item h3 {
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                .weather-item p {
                    font-size: 1.4rem;
                    margin: 0;
                    color: #222;
                    font-weight: bold;
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
                        <h3>강수확률</h3>
                        <p id="precipitation">-</p>
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

    updateContent(current) {
        if (!current) return;
        const weatherDataContainer = this.shadowRoot.getElementById('weather-data');
        
        // Weather codes to text
        const weatherCodes = {
            0: '맑음', 1: '대체로 맑음', 2: '구름 조금', 3: '흐림',
            45: '안개', 48: '안개', 51: '가랑비', 53: '가랑비', 55: '가랑비',
            61: '비', 63: '비', 65: '강한 비', 71: '눈', 73: '눈', 75: '폭설',
            80: '소나기', 81: '소나기', 82: '강한 소나기', 95: '천둥번개'
        };

        weatherDataContainer.querySelector('#current-condition').textContent = weatherCodes[current.weathercode] || '알 수 없음';
        weatherDataContainer.querySelector('#temp-c').textContent = `${current.temperature}°C`;
        weatherDataContainer.querySelector('#precipitation').textContent = `${current.precipitation !== undefined ? current.precipitation : 0}%`;
        weatherDataContainer.querySelector('#wind-speed').textContent = `${current.windspeed} km/h`;
        weatherDataContainer.querySelector('#humidity').textContent = `${current.relative_humidity_2m || '-'}%`;
    }
}

class ExchangeCard extends HTMLElement {
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
                .exchange-card {
                    background-color: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(8px);
                    padding: 1.5rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: #333;
                }
                .exchange-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                    text-align: center;
                }
                .exchange-item h3 {
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                .exchange-item p {
                    font-size: 1.6rem;
                    margin: 0;
                    font-weight: bold;
                    color: #d32f2f;
                }
                .unit {
                    font-size: 0.9rem;
                    color: #777;
                    margin-left: 0.3rem;
                }
            </style>
            <div class="exchange-card">
                <div class="exchange-grid" id="exchange-data">
                    <div class="exchange-item">
                        <h3>미국 달러 (USD)</h3>
                        <p><span id="usd-rate">-</span><span class="unit">KRW</span></p>
                    </div>
                    <div class="exchange-item">
                        <h3>일본 엔 (JPY 100)</h3>
                        <p><span id="jpy-rate">-</span><span class="unit">KRW</span></p>
                    </div>
                </div>
            </div>
        `;
    }

    updateContent(rates) {
        if (!rates) return;
        const exchangeDataContainer = this.shadowRoot.getElementById('exchange-data');
        const usdToKrw = (1 / rates.USD).toFixed(2);
        const jpyToKrw = (100 / rates.JPY).toFixed(2);
        exchangeDataContainer.querySelector('#usd-rate').textContent = usdToKrw;
        exchangeDataContainer.querySelector('#jpy-rate').textContent = jpyToKrw;
    }
}

class QRCard extends HTMLElement {
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
                .qr-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    background-color: rgba(255, 255, 255, 0.85);
                    padding: 1.5rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
                input {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: 1px solid #ddd;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: none;
                    background-color: #4A90E2;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }
                #qr-image {
                    margin-top: 1rem;
                    display: none;
                    width: 150px;
                    height: 150px;
                }
            </style>
            <div class="qr-container">
                <input type="text" id="qr-input" placeholder="URL 또는 텍스트 입력">
                <button id="qr-gen-btn">QR코드 생성</button>
                <img id="qr-image" alt="QR Code">
            </div>
        `;

        const btn = this.shadowRoot.getElementById('qr-gen-btn');
        const input = this.shadowRoot.getElementById('qr-input');
        const img = this.shadowRoot.getElementById('qr-image');

        btn.addEventListener('click', () => {
            const val = input.value.trim();
            if (val) {
                img.src = \`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=\${encodeURIComponent(val)}\`;
                img.style.display = 'block';
            }
        });
    }
}

class LottoCard extends HTMLElement {
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
                .lotto-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    background-color: rgba(255, 255, 255, 0.85);
                    padding: 1.5rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
                .numbers {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f0f0f0;
                    font-weight: bold;
                    color: #333;
                    font-size: 1.1rem;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                button {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: none;
                    background-color: #50E3C2;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                }
                .num-1 { background-color: #fbc02d; color: white; }
                .num-10 { background-color: #1976d2; color: white; }
                .num-20 { background-color: #d32f2f; color: white; }
                .num-30 { background-color: #7b1fa2; color: white; }
                .num-40 { background-color: #388e3c; color: white; }
            </style>
            <div class="lotto-container">
                <div class="numbers" id="lotto-numbers">
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                    <div class="number">?</div>
                </div>
                <button id="lotto-btn">번호 생성하기</button>
            </div>
        `;

        const btn = this.shadowRoot.getElementById('lotto-btn');
        const container = this.shadowRoot.getElementById('lotto-numbers');

        btn.addEventListener('click', () => {
            const nums = [];
            while(nums.length < 6) {
                const r = Math.floor(Math.random() * 45) + 1;
                if(!nums.includes(r)) nums.push(r);
            }
            nums.sort((a, b) => a - b);

            container.innerHTML = nums.map(n => {
                let colorClass = 'num-1';
                if (n >= 11 && n <= 20) colorClass = 'num-10';
                else if (n >= 21 && n <= 30) colorClass = 'num-20';
                else if (n >= 31 && n <= 40) colorClass = 'num-30';
                else if (n >= 41) colorClass = 'num-40';
                return \`<div class="number \${colorClass}">\${n}</div>\`;
            }).join('');
        });
    }
}

customElements.define('weather-card', WeatherCard);
customElements.define('exchange-card', ExchangeCard);
customElements.define('qr-card', QRCard);
customElements.define('lotto-card', LottoCard);

const citySelect = document.getElementById('city-select');
const detailsButton = document.getElementById('details-button');
const weatherUpdated = document.getElementById('weather-updated');
const exchangeUpdated = document.getElementById('exchange-updated');
const weatherCard = document.querySelector('weather-card');
const exchangeCard = document.querySelector('exchange-card');

// City Coordinates for Open-Meteo
const cityCoords = {
    'Seoul': { lat: 37.5665, lon: 126.9780 },
    'Busan': { lat: 35.1796, lon: 129.0756 },
    'Incheon': { lat: 37.4563, lon: 126.7052 },
    'Daegu': { lat: 35.8714, lon: 128.6014 },
    'Daejeon': { lat: 36.3504, lon: 127.3845 },
    'Gwangju': { lat: 35.1595, lon: 126.8526 },
    'Ulsan': { lat: 35.5384, lon: 129.3114 }
};

async function fetchWeatherData(city) {
    try {
        const coords = cityCoords[city];
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Merging current weather with some extra hourly info for humidity
        return {
            ...data.current_weather,
            relative_humidity_2m: data.hourly.relative_humidity_2m[0],
            precipitation: data.hourly.precipitation_probability[0]
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/KRW');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
}

const weatherBackgrounds = {
    'Sunny': 'https://images.unsplash.com/photo-1470252649358-96949c93eaa4?auto=format&fit=crop&w=1920&q=80', // 밝은 들판과 태양
    'Cloudy': 'https://images.unsplash.com/photo-1500491460312-750eb08f2121?auto=format&fit=crop&w=1920&q=80', // 밝은 구름
    'Rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80', // 비 오는 창가
    'Snow': 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1920&q=80', // 하얀 눈 세상
    'Mist': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80',
    'Default': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80' // 화창한 산맥
};

function updateBackground(code) {
    let bgUrl = weatherBackgrounds['Default'];
    
    // Open-Meteo codes
    if (code <= 1) bgUrl = weatherBackgrounds['Sunny'];
    else if (code <= 3) bgUrl = weatherBackgrounds['Cloudy'];
    else if (code >= 51 && code <= 67) bgUrl = weatherBackgrounds['Rain'];
    else if (code >= 71 && code <= 77) bgUrl = weatherBackgrounds['Snow'];
    else if (code >= 80 && code <= 82) bgUrl = weatherBackgrounds['Rain'];
    else if (code >= 45 && code <= 48) bgUrl = weatherBackgrounds['Mist'];

    document.body.style.backgroundImage = `url('${bgUrl}')`;
}

async function updateWeather() {
    const selectedCity = citySelect.value;
    weatherUpdated.textContent = '정보를 가져오는 중...';
    const data = await fetchWeatherData(selectedCity);
    if (data) {
        weatherCard.updateContent(data);
        updateBackground(data.weathercode);
        const now = new Date();
        const timeString = now.toLocaleString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        weatherUpdated.textContent = `제공 일시: ${timeString}`;
    } else {
        weatherUpdated.textContent = '날씨 정보를 가져오는 데 실패했습니다.';
    }
}

async function updateExchangeRates() {
    const data = await fetchExchangeRates();
    if (data && data.rates) {
        exchangeCard.updateContent(data.rates);
        const now = new Date();
        exchangeUpdated.textContent = `정보 업데이트: ${now.toLocaleString()}`;
    }
}

citySelect.addEventListener('change', updateWeather);

detailsButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    window.open(`https://www.google.com/search?q=${selectedCity}+weather`, '_blank');
});

// Initial updates
updateWeather();
updateExchangeRates();
