const BASE_API_URL = 'https://date.nager.at/api/v3/PublicHolidays/';

const statusDisplay = document.getElementById('status-display');
const countryInput = document.getElementById('country-input');
const setCountryBtn = document.getElementById('set-country-btn');
const currentCountryDisplay = document.getElementById('current-country');

function getCurrentDateAndYear() {
    const today = new Date();
    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`; 
    
    return { 
        year: year, 
        todayStr: todayStr,
        todayDate: new Date(Date.UTC(year, today.getMonth(), today.getDate())) 
    };
}

function isSunday(dateObj) {
    return dateObj.getUTCDay() === 0; 
}

async function checkHoliday(countryCode) {
    const { year, todayStr, todayDate } = getCurrentDateAndYear();
    
    const apiUrl = `${BASE_API_URL}${year}/${countryCode}`;
    
    statusDisplay.textContent = `${countryCode} checking...`;
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`API error : ${response.status}`);
        }
        
        const holidays = await response.json();
        
        const todayHoliday = holidays.find(h => h.date === todayStr);
        const todayIsSunday = isSunday(todayDate);

        if (todayHoliday || todayIsSunday) {
            let holidayName;
            if (todayHoliday) {
                holidayName = todayHoliday.name;
            } else {
                holidayName = "Sunday";
            }
            
            statusDisplay.textContent = `Today is holiday! (${holidayName})`;
            statusDisplay.style.backgroundColor = '#B0E0E6';
        } else {
            statusDisplay.textContent = `Today is not holiday.`;
            statusDisplay.style.backgroundColor = '#990000';
        }
    } catch (error) {
        console.error("Data load error : ", error);
        statusDisplay.textContent = `Error. 국가 코드(${countryCode}) 확인`;
        statusDisplay.style.backgroundColor = '#FFD700';
    }
}

function loadCountryAndCheckHoliday() {
    chrome.storage.sync.get(['countryCode'], function(result) {
        const storedCode = result.countryCode;
        
        if (storedCode) {
            const upperCode = storedCode.toUpperCase();
            currentCountryDisplay.textContent = `현재 설정된 국가: ${upperCode}`;
            checkHoliday(upperCode);
        } else {
            statusDisplay.textContent = '국가 코드를 설정하고 "Save" 클릭';
        }
    });
}

setCountryBtn.addEventListener('click', function() {
    const code = countryInput.value.trim().toUpperCase();
    if (code.length === 2) {
        chrome.storage.sync.set({ 'countryCode': code }, function() {
            loadCountryAndCheckHoliday();
        });
    } else {
        alert('유효한 2자리 국가 코드를 입력');
    }
});

document.addEventListener('DOMContentLoaded', loadCountryAndCheckHoliday);