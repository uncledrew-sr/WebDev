const form = document.querySelector('.form-data');
const regionInput = document.querySelector('.region-name');
const apiKeyInput = document.querySelector('.api-key');
const searchBtn = document.querySelector('.search-btn');
const clearBtn = document.querySelector('.clear-btn');

const resultDiv = document.querySelector('.result');
const formDataDiv = document.querySelector('.form-data');
const loadingDiv = document.querySelector('.loading');
const errorsDiv = document.querySelector('.errors');
const myRegionSpan = document.querySelector('.my-region');
const carbonUsageSpan = document.querySelector('.carbon-usage');
const fossilFuelSpan = document.querySelector('.fossil-fuel');

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const THEME_KEY = 'currentTheme';

const API_KEY_STORAGE = 'apiKey';
const REGION_NAME_STORAGE = 'regionName';

function initializeTheme() {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
        body.setAttribute('dark-theme', storedTheme);
    } else {
        body.setAttribute('dark-theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = body.getAttribute('dark-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('dark-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
}

function setUIState(showForm, showResult, showLoading, showError, errorMessage = '') {
    formDataDiv.style.display = showForm ? 'block' : 'none';
    resultDiv.style.display = showResult ? 'block' : 'none';
    loadingDiv.style.display = showLoading ? 'block' : 'none';
    errorsDiv.style.display = showError ? 'block' : 'none';
    errorsDiv.textContent = errorMessage; // 오류 메시지 설정
}

async function displayCarbonUsage(apiKey, region) {
    setUIState(false, true, true, false);

    try {
        const response = await fetch(`https://api.electricitymaps.com/v3/carbon-intensity/latest?zone=${region}`, {
            headers: {
                'auth-token': apiKey
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const carbonData = await response.json();

        const carbonIntensity = Math.round(carbonData.carbonIntensity);
        const fossilFuelPercentage = carbonData.fossilFuelPercentage.toFixed(2);

        myRegionSpan.textContent = region.toUpperCase();
        carbonUsageSpan.textContent = `${carbonIntensity} grams CO2 emitted per kilowatt hour`;
        fossilFuelSpan.textContent = `${fossilFuelPercentage}%`;

        setUIState(false, true, false, false);
        calculateColor(carbonIntensity);
    } catch (error) {
        console.error('Error fetching carbon data:', error);
        setUIState(false, true, false, true, `Error: ${error.message}. Please check your API Key or Region Name.`);
    }
}

function setUpUser(apiKey, regionName) {
    localStorage.setItem(API_KEY_STORAGE, apiKey);
    localStorage.setItem(REGION_NAME_STORAGE, regionName);
    displayCarbonUsage(apiKey, regionName);
}

function reset() {
    localStorage.removeItem(REGION_NAME_STORAGE);
    localStorage.removeItem(API_KEY_STORAGE);
    regionInput.value = '';
    apiKeyInput.value = '';
    init();
}

function calculateColor(value) {
    let color = '#2AA364';
    if (value > 800) {
        color = '#381D02';
    } else if (value > 750) {
        color = '#9E4229';
    } else if (value > 600) {
        color = '#F5EB4D';
    } else if (value > 150) {
        color = '#2AA364';
    }

    chrome.runtime.sendMessage({ action: 'updateIcon', color: color });
}

function init() {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE);
    const savedRegionName = localStorage.getItem(REGION_NAME_STORAGE);

    if (savedApiKey && savedRegionName) {
        displayCarbonUsage(savedApiKey, savedRegionName);
    } else {
        setUIState(true, false, false, false);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const region = regionInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (region && apiKey) {
        setUpUser(apiKey, region);
    } else {
        setUIState(true, false, false, true, "Please enter both Region Name and API Key.");
    }
});

clearBtn.addEventListener('click', reset);
darkModeToggle.addEventListener('click', toggleTheme);

initializeTheme();
init();