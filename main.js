class WeatherCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() { this.render(); }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .weather-card { background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); color: #333; }
                .weather-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 1rem; text-align: center; }
                .weather-item h3 { font-size: 0.75rem; color: #666; margin-bottom: 0.3rem; }
                .weather-item p { font-size: 1.1rem; margin: 0; font-weight: 800; }
            </style>
            <div class="weather-card">
                <div class="weather-grid" id="weather-data">
                    <div class="weather-item"><h3>상태</h3><p id="current-condition">-</p></div>
                    <div class="weather-item"><h3>온도</h3><p id="temp-c">-</p></div>
                    <div class="weather-item"><h3>강수</h3><p id="precipitation">-</p></div>
                    <div class="weather-item"><h3>풍속</h3><p id="wind-speed">-</p></div>
                    <div class="weather-item"><h3>습도</h3><p id="humidity">-</p></div>
                </div>
            </div>`;
    }
    updateContent(current) {
        if (!current) return;
        const root = this.shadowRoot;
        const codes = { 0: '맑음', 1: '대체로 맑음', 2: '구름조금', 3: '흐림', 45: '안개', 61: '비', 71: '눈', 95: '천둥번개' };
        root.getElementById('current-condition').textContent = codes[current.weathercode] || '알 수 없음';
        root.getElementById('temp-c').textContent = `${current.temperature}°C`;
        root.getElementById('precipitation').textContent = `${current.precipitation || 0}%`;
        root.getElementById('wind-speed').textContent = `${current.windspeed}km/h`;
        root.getElementById('humidity').textContent = `${current.relative_humidity_2m || '-'}%`;
    }
}

class ExchangeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.rates = null;
    }
    connectedCallback() { this.render(); }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .exchange-card { background: white; padding: 1.5rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .rate-display { display: flex; gap: 1rem; margin-bottom: 1.5rem; justify-content: space-around; }
                .rate-item { text-align: center; }
                .rate-item h3 { font-size: 0.8rem; color: #666; }
                .rate-item p { font-size: 1.2rem; font-weight: 800; color: #d32f2f; margin: 0; }
                .converter { border-top: 1px solid #eee; padding-top: 1rem; }
                .input-group { display: flex; align-items: center; gap: 0.5rem; background: #f8f9fa; padding: 0.5rem; border-radius: 10px; margin-bottom: 0.5rem; }
                .input-group label { width: 40px; font-weight: bold; font-size: 0.8rem; }
                input { flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px; text-align: right; }
            </style>
            <div class="exchange-card">
                <div class="rate-display">
                    <div class="rate-item"><h3>USD/KRW</h3><p id="usd-rate">-</p></div>
                    <div class="rate-item"><h3>JPY(100)/KRW</h3><p id="jpy-rate">-</p></div>
                </div>
                <div class="converter">
                    <div class="input-group"><label>KRW</label><input type="number" id="krw-input" placeholder="원"></div>
                    <div class="input-group"><label>USD</label><input type="number" id="usd-input" placeholder="달러"></div>
                    <div class="input-group"><label>JPY</label><input type="number" id="jpy-input" placeholder="엔"></div>
                </div>
            </div>`;
        this.shadowRoot.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => this.calculate(e.target.id.split('-')[0].toUpperCase()));
        });
    }
    updateContent(rates) {
        this.rates = rates;
        this.shadowRoot.getElementById('usd-rate').textContent = (1 / rates.USD).toFixed(2);
        this.shadowRoot.getElementById('jpy-rate').textContent = (100 / rates.JPY).toFixed(2);
    }
    calculate(type) {
        if (!this.rates) return;
        const krwIn = this.shadowRoot.getElementById('krw-input');
        const usdIn = this.shadowRoot.getElementById('usd-input');
        const jpyIn = this.shadowRoot.getElementById('jpy-input');
        const uToK = 1 / this.rates.USD;
        const jToK = 100 / this.rates.JPY;
        if (type === 'KRW') {
            const val = parseFloat(krwIn.value) || 0;
            usdIn.value = (val / uToK).toFixed(2);
            jpyIn.value = (val / jToK * 100).toFixed(0);
        } else if (type === 'USD') {
            const val = parseFloat(usdIn.value) || 0;
            krwIn.value = (val * uToK).toFixed(0);
            jpyIn.value = (val * uToK / jToK * 100).toFixed(0);
        } else if (type === 'JPY') {
            const val = parseFloat(jpyIn.value) || 0;
            krwIn.value = (val * jToK / 100).toFixed(0);
            usdIn.value = (val * jToK / 100 / uToK).toFixed(2);
        }
    }
}

class QRCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .qr-box { background: white; padding: 1.5rem; border-radius: 15px; text-align: center; }
                input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box; }
                button { width: 100%; padding: 0.8rem; background: #4A90E2; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
                img { margin-top: 1rem; max-width: 150px; display: none; margin-left: auto; margin-right: auto; }
            </style>
            <div class="qr-box">
                <input type="text" id="qr-input" placeholder="URL 또는 텍스트 입력">
                <button id="gen-btn">QR 생성하기</button>
                <img id="qr-img" alt="QR Code">
            </div>`;
        this.shadowRoot.getElementById('gen-btn').addEventListener('click', () => {
            const val = this.shadowRoot.getElementById('qr-input').value;
            if (val) {
                const img = this.shadowRoot.getElementById('qr-img');
                img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(val)}`;
                img.style.display = 'block';
            }
        });
    }
}

class LottoCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-box { text-align: center; padding: 1rem; background: white; border-radius: 15px; }
                .nums { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; min-height: 40px; }
                .num { width: 35px; height: 35px; border-radius: 50%; background: #4A90E2; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
                button { width: 100%; padding: 0.8rem; background: #50E3C2; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
            </style>
            <div class="lotto-box">
                <div class="nums" id="nums"></div>
                <button id="lotto-btn">번호 추첨</button>
            </div>`;
        this.shadowRoot.getElementById('lotto-btn').addEventListener('click', () => {
            const container = this.shadowRoot.getElementById('nums');
            container.innerHTML = '';
            const nums = [];
            while(nums.length < 6) {
                const r = Math.floor(Math.random() * 45) + 1;
                if(!nums.includes(r)) nums.push(r);
            }
            nums.sort((a,b) => a-b).forEach(n => {
                const d = document.createElement('div');
                d.className = 'num';
                d.textContent = n;
                container.appendChild(d);
            });
        });
    }
}

customElements.define('weather-card', WeatherCard);
customElements.define('exchange-card', ExchangeCard);
customElements.define('qr-card', QRCard);
customElements.define('lotto-card', LottoCard);

// Core Logic
async function updateWeather() {
    const city = document.getElementById('city-select').value;
    const coords = { 'Seoul': [37.56, 126.97], 'Busan': [35.17, 129.07], 'Incheon': [37.45, 126.70], 'Daegu': [35.87, 128.60], 'Daejeon': [36.35, 127.38], 'Gwangju': [35.15, 126.85], 'Ulsan': [35.53, 129.31] };
    const [lat, lon] = coords[city];
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,precipitation_probability`);
        const data = await res.json();
        document.querySelector('weather-card').updateContent({ ...data.current_weather, relative_humidity_2m: data.hourly.relative_humidity_2m[0], precipitation: data.hourly.precipitation_probability[0] });
        document.getElementById('weather-updated').textContent = `업데이트: ${new Date().toLocaleString()}`;
    } catch(e) { console.error(e); }
}

async function updateExchange() {
    try {
        const res = await fetch('https://open.er-api.com/v6/latest/KRW');
        const data = await res.json();
        document.querySelector('exchange-card').updateContent(data.rates);
        document.getElementById('exchange-updated').textContent = `업데이트: ${new Date().toLocaleString()}`;
    } catch(e) { console.error(e); }
}

document.getElementById('city-select').addEventListener('change', updateWeather);
document.getElementById('details-button').addEventListener('click', () => {
    window.open(`https://www.google.com/search?q=${document.getElementById('city-select').value}+날씨`, '_blank');
});

updateWeather();
updateExchange();
