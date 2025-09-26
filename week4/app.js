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

// array
// 개발자 도구로 실행
/* iceCreamFlavers 배열 선언 */
let iceCreamFlavors = ["Chocolate", "Strawberry", "Vanilla", "Pistachio", "Neapolitan"];
/* iceCreamFlavers 4번째 index 선택 */
iceCreamFlavors[3] // Pistachio
/* iceCreamFlavers 5번째 index 변경 */
iceCreamFlavors[4] = "Butter Pecan"; //Changes "Neapolitan" to "Butter Pecan"
/* iceCreamFlavers 배열에 추가 */
iceCreamFlavors.push("Mint Chip");

// 개발자 도구로 실행
/* iceCreamFlavers 배열 길이 */
iceCreamFlavors.length // 6 flavors, because you recently added "Mint Chip"
/* iceCreamFlavers 마지막 값 제거 */
delete iceCreamFlavors[iceCreamFlavors.length-1];
console.log(iceCreamFlavors[length-1]) // undefined
/* iceCreamFlavers 마지막 값 추가 */
iceCreamFlavors[iceCreamFlavors.length-1] = "Mint Choco";

// 개발자 도구로 실행
/* splice() 메서드로 Vanilla 제외 */
iceCreamFlavors.splice(2,1);
iceCreamFlavors // [ 'Chocolate', 'Strawberry', 'Pistachio', /* removedIceCreams 배열에 저장 */
let removedIceCreams = iceCreamFlavors.splice(1,2);
removedIceCreams // [ 'Strawberry', 'Pistachio' ]

// for loop
// 개발자 도구로 실행
/* 1씩 증가 */
for (let i = 0; i < 10; i++ ) {
    console.log(i);
}
/* 2씩 증가 */
for (let i = 0; i < 10; i+=2 ) {
    console.log(i);
}
/* 10 카운트다운 */
for (let i = 10; i > -1; i-=1 ) {
    console.log(i);
}

// while loop
// 개발자 도구로 실행
/* 10 카운트업 */
let i = 0;
while (i <= 10) {
console.log(i);
i++;
}

// loop % array
// 개발자 도구로 실행
/* 배열 값 출력 */
let iceCreamFlavors = ["Chocolate", "Strawberry", "Vanilla", "Pistachio", "Neapolitan", "Mint Chip"];
for (let i = 0; i < iceCreamFlavors.length; i++) { // let을 사용하는 이유는 const는 상수여서 값을 바꾸면 안됨
console.log(iceCreamFlavors[i]);
}

// forEach()
// 개발자 도구로 실행
/* 배열 객체 메서드 forEach() 사용 */
let numbers = [1, 2, 3, 4, 5];
numbers.forEach(number => console.log(number)); // 1 2 3 4 5
/* forEach 매개변수 */
numbers.forEach((value, index, array) => console.log(`Number ${value} ${index} ${array}`));

// break
// 개발자 도구로 실행
/* loop 종료 */
let numbers2 = [1, 2, -1, 4, 5];
for(let i = 0; i< numbers2.length; i++) {
if (numbers2[i] < 0) {
break;
}
console.log(numbers2[i]);
}
// forEach() 메서드는 break로 loop를 멈출 수 없음

// find()
// 개발자 도구로 실행
/* find 매개변수 */
let numbers3 = [1, 2, 3, 4, 5];
numbers3.find((value, index, array) => console.log(`Number ${value} ${index} ${array}`));
/* find() 메서드로 */
let iceCreamFlavors = ["Chocolate", "Strawberry", "Vanilla", "Pistachio", "Neapolitan", "Mint Chip"];
iceCreamFlavors.find(flavor => flavor === "Chocolate") // "Chocolate"
iceCreamFlavors.find(flavor => flavor === "Mint Choco") // undefined

// 개발자 도구로 실행
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jack' }
];
let foundUser = users.find(user => {
    return user.id === 2;
});
console.log(foundUser); // {id: 2, name: 'Jane'}
// find()는 특정 조건을 갖는 객체를 찾는 데 유용함

// filter()
// 개발자 도구로 실행
let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate" },
    { name: "Strawberry", type: "fruit"},
    { name: "Vanilla", type: "Vanilla"},
    { name: "Pistachio", type: "Nuts"},
    { name: "Neapolitan", type: "Chocolate"},
    { name: "Mint Chip", type: "Chocolate"}
];
iceCreamFlavors.filter(flavor => flavor.type === "Chocolate")
// [{ name: "Chocolate", type: "Chocolate" }, { name: "Neapolitan", type: "Chocolate"}, { name: "Mint Chip", type: "Chocolate"}]

// 개발자 도구로 실행
let numbers4 = [5, 12, 8, 130, 44];
/* find: 조건을 만족하는 첫 번째 요소만 반환 */
let found = numbers4.find(number => number > 10);
console.log(found); // 12
/* filter: 조건을 만족하는 모든 요소를 배열로 반환 */
let filtered = numbers4.filter(number => number > 10);
console.log(filtered); // [12, 130, 44]
/*
find() 첫 번째로 조건을 만족하는 요소만 반환
filter() 모든 요소들을 배열로 반환
*/

// some()
// 개발자 도구로 실행
let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate" },
    { name: "Strawberry", type: "fruit"},
    { name: "Vanilla", type: "Vanilla"},
    { name: "Pistachio", type: "Nuts"},
    { name: "Neapolitan", type: "Chocolate"},
    { name: "Mint Chip", type: "Chocolate"}
];
iceCreamFlavors.some(flavor => flavor.type === "Nuts") // Nuts 가 있다면 true 반환
iceCreamFlavors.filter(flavor => flavor.type !== "Nuts") // Nuts가 없는 다른 모든 것을 반환

// 개발자 도구로 실행
let users2 = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 22 },
    { name: 'Jack', age: 30 }
];
let hasAdult = users2.some(user => {
return user.age >= 30;
});
console.log(hasAdult); // true
// some() 메서드는 객체 배열에서 특정 조건을 만족하는 객체가 존재하는 지 확인할 때 사용함

// map()
// 개발자 도구로 실행
let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate" },
    { name: "Strawberry", type: "fruit"},
    { name: "Vanilla", type: "Vanilla"},
    { name: "Pistachio", type: "Nuts"},
    { name: "Neapolitan", type: "Chocolate"},
    { name: "Mint Chip", type: "Chocolate"}
];
iceCreamFlavors.map(flavor => {
    flavor.price = 1;
    return flavor;
}) // 모든 객체에 price: 1 추가
// map() 메서드는 새로운 배열을 반환함

// reduce()
// 개발자 도구로 실행
let sales = [{
    date : '2021-05-01',
    amount: 2
    },
    {
    date : '2021-05-02',
    amount: 3
    }
]
let sum = 0;
for( let i = 0; i < sales.length; i++) {
    sum += sales[i].amount;
} // for 문을 사용하여 합산
sales.reduce((acc, curr) => acc + curr.amount, 0); // reduce() 메서드 사용하여 합산
// reduce() 메서드는 배열을 하나의 값으로 줄이기 위해 사용함


