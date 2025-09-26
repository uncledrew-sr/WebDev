// blackjack.js
/*
블랙잭?
- 카드 합계 점수가 21을 넘지 않으면서 최대한 21에 가까운 사람이 승리하는 게임
- 숫자 카드 2~10, 그림 카드(J, Q, K)는 10, 에이스(A)는 1 or 10
- 딜러의 합계가 21을 초과하면 플레이어 승리
- 첫 두장의 카드가 21이면 블릭잭이며, 플레이어 승리
- 딜러는 17점 이상이 될 때까지 카드를 받아야 함
- 플레이어와 딜러의 점수가 같으면 무승부
*/
let cardOne = 8;
let cardTwo = 4;
let cardThree = 7;
let sum = cardOne + cardTwo + cardThree;

let cardOneBank = 9;
let cardTwoBank = 3;
let cardThreeBank = 5;
let cardFourBank = 5;
let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank;

console.log(`플레이어 최종 점수: ${sum}`);
console.log(`딜러 최종 점수: ${bankSum}`);

// Bust : 21 초과
if (sum > 21) {
    console.log('딜러 승리(플레이어 Bust)');
}
else if (sum === 21) {
    console.log('플레이어 승리(Blackjack)');
}
else if (bankSum > 21) {
    console.log('플레이어 승리(딜러 Bust)');
}
else {
    if (sum > bankSum) {
        console.log('플레이어 승리');
    } else if (sum < bankSum) {
        console.log('딜러 승리');
    } else { // sum === bankSum
        console.log('Draw');
    }
}
// node blackjack.js : blackjack.js 파일 실행