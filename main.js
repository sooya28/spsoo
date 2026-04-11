class WeatherCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = \`
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
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    text-align: center;
                }
                .weather-item h3 {
                    font-size: 0.8rem;
                    color: #555;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                .weather-item p {
                    font-size: 1.2rem;
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
        \`;
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
        weatherDataContainer.querySelector('#temp-c').textContent = \`\${current.temperature}°C\`;
        weatherDataContainer.querySelector('#precipitation').textContent = \`\${current.precipitation !== undefined ? current.precipitation : 0}%\`;
        weatherDataContainer.querySelector('#wind-speed').textContent = \`\${current.windspeed} km/h\`;
        weatherDataContainer.querySelector('#humidity').textContent = \`\${current.relative_humidity_2m || '-'}%\`;
    }
}

class ExchangeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.rates = null;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = \`
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
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                }
                .exchange-item h3 {
                    font-size: 0.8rem;
                    color: #555;
                    margin-bottom: 0.3rem;
                    font-weight: 600;
                }
                .exchange-item p {
                    font-size: 1.3rem;
                    margin: 0;
                    font-weight: bold;
                    color: #d32f2f;
                }
                .unit-label {
                    font-size: 0.75rem;
                    color: #777;
                    margin-left: 0.2rem;
                }
                .converter {
                    border-top: 1px solid #eee;
                    padding-top: 1rem;
                }
                .converter h4 { margin: 0 0 1rem 0; font-size: 0.9rem; color: #444; text-align: center; }
                .input-row {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .input-group {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    background: #f8f9fa;
                    padding: 0.5rem 0.8rem;
                    border-radius: 10px;
                }
                .input-group label {
                    font-weight: bold;
                    color: #555;
                    min-width: 40px;
                    font-size: 0.85rem;
                }
                input {
                    flex: 1;
                    padding: 0.5rem;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    font-size: 1rem;
                    text-align: right;
                    width: 100px;
                }
                input:focus { outline: none; border-color: #4A90E2; }
                .symbol { font-size: 0.85rem; color: #888; min-width: 30px; }
                .help-text {
                    font-size: 0.75rem;
                    color: #999;
                    text-align: center;
                    margin-top: 0.8rem;
                }
            </style>
            <div class="exchange-card">
                <div class="exchange-grid" id="exchange-data">
                    <div class="exchange-item">
                        <h3>USD</h3>
                        <p><span id="usd-rate">-</span><span class="unit-label">KRW</span></p>
                    </div>
                    <div class="exchange-item">
                        <h3>JPY (100)</h3>
                        <p><span id="jpy-rate">-</span><span class="unit-label">KRW</span></p>
                    </div>
                </div>
                <div class="converter">
                    <h4>양방향 환율 계산기</h4>
                    <div class="input-row">
                        <div class="input-group">
                            <label>한국</label>
                            <input type="number" id="krw-input" placeholder="0" min="0">
                            <span class="symbol">KRW</span>
                        </div>
                        <div class="input-group">
                            <label>미국</label>
                            <input type="number" id="usd-input" placeholder="0" min="0">
                            <span class="symbol">USD</span>
                        </div>
                        <div class="input-group">
                            <label>일본</label>
                            <input type="number" id="jpy-input" placeholder="0" min="0">
                            <span class="symbol">JPY</span>
                        </div>
                    </div>
                    <p class="help-text">* 어느 한 곳에 금액을 입력하면 자동 변환됩니다.</p>
                </div>
            </div>
        \`;

        this.krwInput = this.shadowRoot.getElementById('krw-input');
        this.usdInput = this.shadowRoot.getElementById('usd-input');
        this.jpyInput = this.shadowRoot.getElementById('jpy-input');

        this.krwInput.addEventListener('input', () => this.calculate('KRW'));
        this.usdInput.addEventListener('input', () => this.calculate('USD'));
        this.jpyInput.addEventListener('input', () => this.calculate('JPY'));
    }

    calculate(source) {
        if (!this.rates) return;

        const usdToKrw = 1 / this.rates.USD;
        const jpyToKrw = (100 / this.rates.JPY);

        if (source === 'KRW') {
            const val = parseFloat(this.krwInput.value) || 0;
            this.usdInput.value = (val / usdToKrw).toFixed(2);
            this.jpyInput.value = (val / jpyToKrw).toFixed(2);
        } else if (source === 'USD') {
            const val = parseFloat(this.usdInput.value) || 0;
            const krwVal = val * usdToKrw;
            this.krwInput.value = Math.round(krwVal);
            this.jpyInput.value = (krwVal / jpyToKrw).toFixed(2);
        } else if (source === 'JPY') {
            const val = parseFloat(this.jpyInput.value) || 0;
            const krwVal = val * (jpyToKrw / 100);
            this.krwInput.value = Math.round(krwVal);
            this.usdInput.value = (krwVal / usdToKrw).toFixed(2);
        }
    }

    updateContent(rates) {
        if (!rates) return;
        this.rates = rates;
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
        this.shadowRoot.innerHTML = \`
            <style>
                .qr-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.2rem;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 15px;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label { font-size: 0.85rem; font-weight: 600; color: #666; }
                input {
                    padding: 0.8rem;
                    border-radius: 8px;
                    border: 2px solid #eee;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                    box-sizing: border-box;
                    width: 100%;
                }
                input:focus { outline: none; border-color: #4A90E2; }
                .btn-group { display: flex; gap: 0.5rem; }
                button {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: 8px;
                    border: none;
                    background-color: #4A90E2;
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    transition: filter 0.2s;
                }
                button:hover { filter: brightness(1.1); }
                button.secondary { background-color: #f0f0f0; color: #333; }
                .qr-result {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f9f9f9;
                    border-radius: 10px;
                    display: none;
                }
                img { width: 140px; height: 140px; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .download-link {
                    font-size: 0.8rem;
                    color: #4A90E2;
                    text-decoration: none;
                    font-weight: 600;
                }
            </style>
            <div class="qr-container">
                <div class="input-group">
                    <label>URL 또는 텍스트</label>
                    <input type="text" id="qr-input" placeholder="이곳에 내용을 입력하세요">
                </div>
                <div class="btn-group">
                    <button id="qr-gen-btn">생성하기</button>
                    <button id="qr-clear-btn" class="secondary">지우기</button>
                </div>
                <div class="qr-result" id="qr-result-box">
                    <img id="qr-image" alt="QR Code">
                    <a id="download-link" class="download-link" href="#" target="_blank">이미지 다운로드</a>
                </div>
            </div>
        \`;

        const btn = this.shadowRoot.getElementById('qr-gen-btn');
        const clearBtn = this.shadowRoot.getElementById('qr-clear-btn');
        const input = this.shadowRoot.getElementById('qr-input');
        const resultBox = this.shadowRoot.getElementById('qr-result-box');
        const img = this.shadowRoot.getElementById('qr-image');
        const downloadLink = this.shadowRoot.getElementById('download-link');

        btn.addEventListener('click', () => {
            const val = input.value.trim();
            if (val) {
                const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(val)}\`;
                img.src = qrUrl;
                downloadLink.href = qrUrl;
                resultBox.style.display = 'flex';
            }
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            resultBox.style.display = 'none';
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
        this.shadowRoot.innerHTML = \`
            <style>
                .lotto-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 15px;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
                }
                .numbers {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    min-height: 50px;
                }
                .number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    font-size: 1.1rem;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform: scale(0);
                }
                .number.show { transform: scale(1); }
                button {
                    width: 100%;
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: none;
                    background: linear-gradient(135deg, #50E3C2, #4A90E2);
                    color: white;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1rem;
                    box-shadow: 0 4px 15px rgba(80, 227, 194, 0.3);
                }
                button:active { transform: scale(0.98); }
                .num-1 { background: radial-gradient(circle at 30% 30%, #fbc02d, #f57f17); }
                .num-10 { background: radial-gradient(circle at 30% 30%, #1976d2, #0d47a1); }
                .num-20 { background: radial-gradient(circle at 30% 30%, #d32f2f, #b71c1c); }
                .num-30 { background: radial-gradient(circle at 30% 30%, #7b1fa2, #4a148c); }
                .num-40 { background: radial-gradient(circle at 30% 30%, #388e3c, #1b5e20); }
                .placeholder { color: #ccc; font-style: italic; font-size: 0.85rem; }
            </style>
            <div class="lotto-container">
                <div class="numbers" id="lotto-numbers">
                    <p class="placeholder">번호를 생성하세요</p>
                </div>
                <button id="lotto-btn">번호 추첨</button>
            </div>
        \`;

        const btn = this.shadowRoot.getElementById('lotto-btn');
        const container = this.shadowRoot.getElementById('lotto-numbers');

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            container.innerHTML = '';
            
            const nums = [];
            while(nums.length < 6) {
                const r = Math.floor(Math.random() * 45) + 1;
                if(!nums.includes(r)) nums.push(r);
            }
            nums.sort((a, b) => a - b);

            for(let i=0; i<nums.length; i++) {
                const n = nums[i];
                let colorClass = 'num-1';
                if (n >= 11 && n <= 20) colorClass = 'num-10';
                else if (n >= 21 && n <= 30) colorClass = 'num-20';
                else if (n >= 31 && n <= 40) colorClass = 'num-30';
                else if (n >= 41) colorClass = 'num-40';
                
                const ball = document.createElement('div');
                ball.className = \`number \${colorClass}\`;
                ball.textContent = n;
                container.appendChild(ball);
                
                await new Promise(r => setTimeout(r, 100));
                ball.classList.add('show');
            }
            btn.disabled = false;
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
        const response = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${coords.lat}&longitude=\${coords.lon}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability\`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
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
    'Sunny': 'https://images.unsplash.com/photo-1470252649358-96949c93eaa4?auto=format&fit=crop&w=1920&q=80',
    'Cloudy': 'https://images.unsplash.com/photo-1500491460312-750eb08f2121?auto=format&fit=crop&w=1920&q=80',
    'Rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80',
    'Snow': 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1920&q=80',
    'Mist': 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?auto=format&fit=crop&w=1920&q=80',
    'Default': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80'
};

function updateBackground(code) {
    let bgUrl = weatherBackgrounds['Default'];
    if (code <= 1) bgUrl = weatherBackgrounds['Sunny'];
    else if (code <= 3) bgUrl = weatherBackgrounds['Cloudy'];
    else if (code >= 51 && code <= 67) bgUrl = weatherBackgrounds['Rain'];
    else if (code >= 71 && code <= 77) bgUrl = weatherBackgrounds['Snow'];
    else if (code >= 80 && code <= 82) bgUrl = weatherBackgrounds['Rain'];
    else if (code >= 45 && code <= 48) bgUrl = weatherBackgrounds['Mist'];
    document.body.style.backgroundImage = \`url('\${bgUrl}')\`;
}

async function updateWeather() {
    const selectedCity = citySelect.value;
    weatherUpdated.textContent = '정보를 가져오는 중...';
    const data = await fetchWeatherData(selectedCity);
    if (data) {
        weatherCard.updateContent(data);
        updateBackground(data.weathercode);
        const now = new Date();
        weatherUpdated.textContent = \`제공 일시: \${now.toLocaleString()}\`;
    }
}

async function updateExchangeRates() {
    const data = await fetchExchangeRates();
    if (data && data.rates) {
        exchangeCard.updateContent(data.rates);
        const now = new Date();
        exchangeUpdated.textContent = \`정보 업데이트: \${now.toLocaleString()}\`;
    }
}

citySelect.addEventListener('change', updateWeather);
detailsButton.addEventListener('click', () => {
    const selectedCity = citySelect.value;
    window.open(\`https://www.google.com/search?q=\${selectedCity}+weather\`, '_blank');
});

updateWeather();
updateExchangeRates();
