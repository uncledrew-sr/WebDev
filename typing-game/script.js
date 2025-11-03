const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to along train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

// DOM 요소 지정
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

// 🚨 모달 관련 DOM 요소
const modal = document.getElementById('result-modal');
const modalMessage = document.getElementById('modal-time-message');
const closeButton = document.querySelector('.close-button'); 
const restartButton = document.getElementById('modal-close-and-restart'); 
// 🏆 최고 점수 DOM 요소
const bestTimeMessage = document.getElementById('best-time-message'); 

// --- 헬퍼 함수: Local Storage에서 최고 점수를 가져오는 함수 ---
function getBestTime() {
    // Local Storage에서 'typingBestTime' 키로 저장된 값을 가져옵니다.
    // 값이 없으면 null이 반환되므로, Number.MAX_VALUE를 기본값으로 설정합니다.
    const bestTime = localStorage.getItem('typingBestTime');
    return bestTime ? parseFloat(bestTime) : Number.MAX_VALUE;
}

// --- 헬퍼 함수: Local Storage에 새로운 최고 점수를 저장하는 함수 ---
function setBestTime(newTime) {
    const currentBest = getBestTime();
    // 새 시간이 기존 최고 기록보다 빠르면 (작으면) 저장합니다.
    if (newTime < currentBest) {
        localStorage.setItem('typingBestTime', newTime.toFixed(2));
        return true; // 새로운 최고 기록 갱신됨
    }
    return false; // 최고 기록 갱신 안 됨
}


// --- 1. Start 버튼 클릭 이벤트 ---
document.getElementById('start').addEventListener('click', () => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[quoteIndex];
    words = quote.split(' ');
    wordIndex = 0;

    const spanWords = words.map(function(word) { return `<span>${word} </span>` });
    quoteElement.innerHTML = spanWords.join('');
    quoteElement.childNodes[0].className = 'highlight';
    messageElement.innerText = '';

    typedValueElement.value = '';
    typedValueElement.focus();

    startTime = new Date().getTime();

    document.getElementById('start').disabled = true;
});


// --- 2. Input 필드 입력 이벤트 (주요 로직) ---
typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    // 🚨 마지막 단어 완료 로직
    if (typedValue === currentWord && wordIndex === words.length - 1) { 
        const elapsedTime = new Date().getTime() - startTime;
        const seconds = (elapsedTime / 1000); // 초 단위 (toFixed는 문자열로 만들기 위해 나중에 사용)
        const secondsFixed = seconds.toFixed(2);
        
        // 🏆 Local Storage 로직 적용
        const isNewBest = setBestTime(seconds);
        const bestTime = getBestTime();
        
        // 모달 메시지 설정
        modalMessage.innerText = `You finished in ${secondsFixed} seconds.`;
        
        // 최고 점수 메시지 설정
        if (isNewBest) {
            bestTimeMessage.innerHTML = 'NEW Record!';
            bestTimeMessage.style.color = 'gold'; // 새로운 최고 기록 강조
        } else if (bestTime !== Number.MAX_VALUE) {
            bestTimeMessage.innerText = `Best Time : ${bestTime.toFixed(2)} seconds`;
            bestTimeMessage.style.color = 'green';
        } else {
            bestTimeMessage.innerText = ''; // 첫 게임인 경우 표시 안 함
        }
        
        modal.style.display = 'block';
        typedValueElement.blur(); // 키보드 포커스 제거
        document.getElementById('start').disabled = false;

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // 다음 단어로 이동 로직
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        if (quoteElement.childNodes[wordIndex]) {
            quoteElement.childNodes[wordIndex].className = 'highlight';
        }

    } else if (currentWord.startsWith(typedValue)) { 
        typedValueElement.className = 'correct'; 
    } else {
        typedValueElement.className = 'error'; 
    }
});


// --- 3. 모달 닫기/재시작 이벤트 ---

// 닫기 버튼 (X) 클릭 시 모달 닫기
if (closeButton) { 
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// 모달 내 '다시 시작' 버튼 클릭 시 모달 닫고 게임 초기화
if (restartButton) { 
    restartButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('start').click(); 
    });
}

// 모달 외부 클릭 시 모달 닫기
if (modal) { 
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}