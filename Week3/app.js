/*
var (ECMAScript5)
let, const (ECMAScript6) -> 조금 더 명시적으로 변수 선언을 할 수 있다
기존 JS를 전부 다 리팩토링
그렇다고 var을 안 쓰는 것은 아니다
*/

/* 게임 변수 3개 선언 */
/* 상수는 대문자 사용 */
const STARTING_POKER_CHIPS = 100; // points
const PLAYERS = 3;
const NO_OF_STARTER_CARDS = 2;

/* 3개의 플레이어 시작 점수 할당 */
let playerOnePoints = STARTING_POKER_CHIPS;
let playerTwoPoints = STARTING_POKER_CHIPS;
let playerThreePoints = STARTING_POKER_CHIPS;

/* 점수 배팅 */
playerOnePoints -= 50;
playerTwoPoints -= 25;
playerThreePoints += 75;


let playerOneName = "Chloe";
let playerTwoName = "Jasmine";
let playerThreeName = "Jen";

console.log(`Welcome! 챔피언십 타이틀은 ${playerOneName},
${playerTwoName}, ${playerThreeName} 중 한 명에게 주어집니다.
각 선수는 경기가 ${STARTING_POKER_CHIPS} 의 바랍니다!
흥미진진한 경기가 될 것 입니다.
최고의 선수가 승리하길 바랍니다!`);

let gameHasEnded = false;

gameHasEnded = ((playerOnePoints + playerTwoPoints) == 0) || // 플레이어3 우승 조건
((playerTwoPoints + playerThreePoints) == 0) || // 플레이어1 우승 조건
((playerOnePoints + playerThreePoints) == 0); // 플레이어2 우승 조건
console.log("Game has ended: ", gameHasEnded);

// 함수 만들기, 함수 호출
function nameOfFunction(parameter) {
// function body
}
function displayGreeting() {
console.log('Hello, world!');
}
displayGreeting();

// 함수 매개 변수
function name(param, param2, param3) {
}
// name 이라는 매개 변수(parameter)를 가진 함수
function displayGreeting(name) {
// name을 문자열에 넣는 새로운 message 변수를 생성
const message = `Hello, ${name}!`;
// message를 콘솔에 출력
console.log(message);
}
displayGreeting('Christopher')

// 함수 기본값
function displayGreeting(name, salutation='Hello') {
console.log(`${salutation}, ${name}`);
}
displayGreeting('Christopher');
// "Hello, Christopher"
displayGreeting('Christopher', 'Hi');
// "Hi, Christopher"

// 콜백 함수
function displayDone(){
    console.log('Done!');
}
    setTimeout(displayDone(), 3000); // 즉시 실행
    setTimeout(displayDone(), 3000); // 3초후 실행

// 익명 함수
setTimeout(
    function() { // anonymous function
    console.log('Done!');
    },
    3000 // 3000 milliseconds (3 seconds)
)

// 화살표 함수
setTimeout(
    () => { // arrow function
    console.log('Done!');
    },
    3000 // 3000 milliseconds (3 seconds)
)