// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');
// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');


// 리스너 추가
form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

// reset 함수 추가
function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}

// init 함수 추가
function init() {
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    //set icon to be generic green
    // to do
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

// form 제출 처리
function handleSubmit(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}

// apiKey, regionName 로컬 저장소 값 설정
function setUpUser(apiKey, regionName) {
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';

    displayCarbonUsage(apiKey, regionName);
}

/**
 * 💡 핵심 API 호출 함수: 탄소 데이터를 가져와 화면에 표시
 * @param {string} apiKey tmrow API Key
 * @param {string} regionName 요청할 지역 이름 (예: KR, US-CAL)
 */
async function displayCarbonUsage(key, regionName) {
    try {
        const API_ENDPOINT = `https://api.tmrow.com/v1/carbon/latest?zone=${regionName}`;
        
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                // API 인증 방식: tmrow API 문서를 반드시 확인하여 정확한 헤더를 사용하세요.
                // 일반적인 Bearer 토큰 형식 사용 예시
                'Authorization': `Bearer ${key}`, 
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // HTTP 상태 코드 4xx, 5xx 에러 처리
            const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
            throw new Error(`API 요청 실패 (${response.status}): ${errorData.message || '인증 또는 지역 오류.'}`);
        }

        const data = await response.json();

        // 결과 화면 업데이트
        myregion.textContent = regionName;
        
        // API 응답 구조에 따라 키 이름이 다를 수 있습니다.
        const carbonIntensity = data.carbonIntensity;
        const fossilFuel = data.fossilFuelPercentage;
        
        usage.textContent = `${carbonIntensity.toFixed(0)} gCO2/kWh`; // 정수로 반올림하여 표시
        fossilfuel.textContent = `${(fossilFuel * 100).toFixed(1)}%`; // 소수점 첫째 자리까지 백분율로 표시

        // 데이터 표시 후 화면 전환
        results.style.display = 'block';
        
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        errors.textContent = `데이터 로드 실패: ${error.message}`;
        
        // 오류 시에도 결과 화면을 보여주어 오류 메시지를 표시합니다.
        myregion.textContent = regionName;
        usage.textContent = 'N/A';
        fossilfuel.textContent = 'N/A';
        results.style.display = 'block';

    } finally {
        // 로딩 상태 숨기기 (성공/실패와 관계없이)
        loading.style.display = 'none';
    }
}