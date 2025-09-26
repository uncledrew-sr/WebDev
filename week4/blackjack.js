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
let cardOne = 7;
let cardTwo = 5;
let cardThree = 7; // 플레이어의 추가 카드
let sum = cardOne + cardTwo + cardThree; // 플레이어 최종 합계

let cardOneBank = 7;
let cardTwoBank = 5;
let cardThreeBank = 6;
let cardFourBank = 4;
let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank; // 딜러 최종 합계(17점 이상으로 가정)



console.log(`플레이어 최종 점수: ${sum}`);
console.log(`딜러 최종 점수: ${bankSum}`);

// 플레이어 Bust(21 초과) -> 딜러 승리
if (sum > 21) {
    console.log('딜러 승리(Bust: 21 초과)');
}
// 플레이어 Blackjack(21점) -> 즉시 승리
else if (sum === 21) {
    console.log('플레이어 승리(Blackjack!)');
}
// 딜러 Bust (21 초과) -> 플레이어 승리
else if (bankSum > 21) {
    console.log('플레이어 승리(딜러 Bust: 21 초과)');
}
// 점수 비교 (둘 다 21 이하일 때)
else {
    if (sum > bankSum) {
        console.log('플레이어 승리(딜러보다 점수가 높음)');
    } else if (sum < bankSum) {
        console.log('딜러 승리(딜러 점수가 더 높음)');
    } else { // sum === bankSum
        console.log('Draw');
    }
}
// user$ node blackjack.js : blackjack.js 파일 실행