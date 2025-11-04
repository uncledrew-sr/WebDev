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

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

const modal = document.getElementById('result-modal');
const modalMessage = document.getElementById('modal-time-message');
const closeButton = document.querySelector('.close-button'); 
const restartButton = document.getElementById('modal-close-and-restart'); 

const bestTimeMessage = document.getElementById('best-time-message'); 

function getBestTime() {
    const bestTime = localStorage.getItem('typingBestTime');
    return bestTime ? parseFloat(bestTime) : Number.MAX_VALUE;
}

function setBestTime(newTime) {
    const currentBest = getBestTime();
    if (newTime < currentBest) {
        localStorage.setItem('typingBestTime', newTime.toFixed(2));
        return true;
    }
    return false;
}

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


typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) { 
        const elapsedTime = new Date().getTime() - startTime;
        const seconds = (elapsedTime / 1000);
        const secondsFixed = seconds.toFixed(2);
        
        const isNewBest = setBestTime(seconds);
        const bestTime = getBestTime();
        
        modalMessage.innerText = `You finished in ${secondsFixed} seconds.`;
        
        if (isNewBest) {
            bestTimeMessage.innerHTML = 'NEW Record!';
            bestTimeMessage.style.color = 'gold';
        } else if (bestTime !== Number.MAX_VALUE) {
            bestTimeMessage.innerText = `Best Time : ${bestTime.toFixed(2)} seconds`;
            bestTimeMessage.style.color = 'green';
        } else {
            bestTimeMessage.innerText = '';
        }
        
        modal.style.display = 'block';
        typedValueElement.blur();
        document.getElementById('start').disabled = false;

    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
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

if (closeButton) { 
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

if (restartButton) { 
    restartButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('start').click(); 
    });
}

if (modal) { 
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}