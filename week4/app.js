// 비교 연산자 및 Booleans
let myTrueBool = true;
let myFalseBool = false;

let timeOfDay = 8;
let timeToWakeUp = timeOfDay >= 8;

// if else 문
if (condition){
// true일 때, 실행
} else {
// false일 때, 실행
}

let isTrue = true;
if (isTrue) {
// run code if true
}
if (true) {
// run code if true
}

// 개발자 도구로 실행(콘솔에 allow pasting 먼저 입력)
function testNum(a) {
let result;
if (a > 0) {
    result = 'positive';
} else {
    result = 'NOT positive';
}
return result;
}
console.log(testNum(10));

// 고객이 할인이 되는 조건을 설정
let isHoliday = true;
let isMember = true;
let hasDiscount = isHoliday || isMember;

// 개발자 도구로 실행
let currentMoney= 800;
let laptopPrice = 1000;
let laptopDiscountPrice = laptopPrice - (laptopPrice * .20) // laptop 가격에서 20% 할인

// 조건이 true일 때, 이 블록의 코드가 실행.
if (currentMoney >= laptopPrice || currentMoney >= laptopDiscountPrice){
    console.log("새 laptop을 구입합니다!");
}
else { // 조건이 false일 때, 이 블록의 코드가 실행.
    console.log("아직 새 laptop을 살 수 없습니다!");
}

// 부정 연산자
if (!condition) {
// false일 때, 실행
} else {
// true일 때, 실행
}

// let variable = condition ? <return this if true> : <return this if false></return>
// 3항식으로 작성
let firstNumber = 20;
let secondNumber = 10
let biggestNumber = firstNumber > secondNumber ? firstNumber : secondNumber;

// if…else로 작성
// let biggestNumber;
if (firstNumber > secondNumber) {
biggestNumber = firstNumber;
} else {
biggestNumber = secondNumber;
}

// 개발자 도구로 실행
/* iceCreamFlavers 배열 선언 */
let iceCreamFlavors = ["Chocolate", "Strawberry", "Vanilla", "Pistachio", "Neapolitan"];
/* iceCreamFlavers 4번째 index 선택 */
iceCreamFlavors[3] // Pistachio
/* iceCreamFlavers 5번째 index 변경 */
iceCreamFlavors[4] = "Butter Pecan"; //Changes "Neapolitan" to "Butter Pecan"
/* iceCreamFlavers 배열에 추가 */
iceCreamFlavors.push("Mint Chip");

