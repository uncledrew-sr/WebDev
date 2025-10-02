/*
블랙잭?
- 카드 합계 점수가 21을 넘지 않으면서 최대한 21에 가까운 사람이 승리하는 게임
- 숫자 카드 2~10, 그림 카드(J, Q, K)는 10, 에이스(A)는 1 or 10
- 딜러의 합계가 21을 초과하면 플레이어 승리
- 첫 두장의 카드가 21이면 블릭잭이며, 플레이어 승리
- 딜러는 17점 이상이 될 때까지 카드를 받아야 함
- 플레이어와 딜러의 점수가 같으면 무승부
*/

// min(최솟값), max(최댓값)을 포함하는 정수 난수 생성 함수
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 플레이어 카드 점수 (값 고정))
let cardOne = 7;
let cardTwo = 8;
let cardThree = 2;
let sum = cardOne + cardTwo + cardThree;

// 딜러 카드 점수 (랜덤 생성)
let cardOneBank = getRandomIntInclusive(2, 11); // 2부터 11 사이의 정수 난수를 가정
let cardTwoBank = getRandomIntInclusive(2, 11);
/* 딜러는 17점 이상이 될 때까지 카드를 받아야 하므로, 
여기서는 두 장의 카드가 17 미만일 경우 한 장을 더 받도록 가정 */
let initialBankSum = cardOneBank + cardTwoBank;
let cardThreeBank = 0; 

// 딜러는 17점 이상이 될 때까지 카드를 받아야 함 (간단한 구현)
if (initialBankSum < 17) {
    cardThreeBank = getRandomIntInclusive(2, 11);
    // 두 장의 카드 합이 17점 미만이면 세번째 카드 받기
}
let bankSum = initialBankSum + cardThreeBank;

console.log(`플레이어 최종 점수 : ${sum}`);
console.log(`딜러 카드 1 : ${cardOneBank}, 딜러 카드 2 : ${cardTwoBank}` + (cardThreeBank > 0 ? `, 딜러 카드 3: ${cardThreeBank}` : ''));
console.log(`딜러 최종 점수 : ${bankSum}`);

// Bust : 21 초과
if (sum > 21) { // 플레이어 카드 합이 21 초과(Bust)
    console.log('딜러 승리(플레이어 Bust)');
}
else if (bankSum > 21) { // 딜러 카드 합이 21 초과(Bust)
    console.log('플레이어 승리(딜러 Bust)');
}
// 플레이어가 Bust 하지 않았고, 딜러도 Bust 하지 않은 경우
else {
    if (sum === 21 && bankSum !== 21) {
        console.log('플레이어 Blackjack');
    } else if (bankSum === 21 && sum !== 21) {
        console.log('딜러 Blackjack');
    } else if (sum > bankSum) {
        console.log('플레이어 승리');
    } else if (sum < bankSum) {
        console.log('딜러 승리');
    } else { // sum === bankSum
        console.log('Draw');
    }
}