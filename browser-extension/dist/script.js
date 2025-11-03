// DOM 요소 선택
const formArea = document.querySelector('.form-data');
const resultArea = document.querySelector('.result');
const submitButton = document.querySelector('.search-btn');
const changeRegionButton = document.querySelector('.clear-btn');

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const regionName = document.getElementById('region').value;
    const apiKey = document.getElementById('api').value;

    if (!regionName || !apiKey) {
        alert('Region Name과 API Key를 모두 입력해주세요.');
        return;
    }

    formArea.style.display = 'none';

    resultArea.style.display = 'block';
    
    document.querySelector('.my-region').textContent = regionName;
    document.querySelector('.carbon-usage').textContent = '200 gCO2/kWh';
    document.querySelector('.fossil-fuel').textContent = '45%';
});

changeRegionButton.addEventListener('click', () => {
    resultArea.style.display = 'none';

    formArea.style.display = 'block';
});