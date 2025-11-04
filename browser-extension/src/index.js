const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');

const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}

function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    if (storedApiKey === null || storedRegion === null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        displayCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
};

function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';

    displayCarbonUsage(apiKey, regionName);
}

async function displayCarbonUsage(key, regionName) {
    try {
        const API_ENDPOINT = `https://api.tmrow.com/v1/carbon/latest?zone=${regionName}`;
        
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
            throw new Error(`API 요청 실패 (${response.status}): ${errorData.message || '인증 또는 지역 오류.'}`);
        }

        const data = await response.json();

        myregion.textContent = regionName;
        
        const carbonIntensity = data.carbonIntensity;
        const fossilFuel = data.fossilFuelPercentage;
        
        usage.textContent = `${carbonIntensity.toFixed(0)} gCO2/kWh`;
        fossilfuel.textContent = `${(fossilFuel * 100).toFixed(1)}%`;

        results.style.display = 'block';
        
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        errors.textContent = `데이터 로드 실패: ${error.message}`;
        
        myregion.textContent = regionName;
        usage.textContent = 'N/A';
        fossilfuel.textContent = 'N/A';
        results.style.display = 'block';

    } finally {
        loading.style.display = 'none';
    }
}