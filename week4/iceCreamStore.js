let iceCreamFlavors = [ // let은 변수가 재할당 될 수 있음을 나타냄
    { name: "Chocolate", type: "Chocolate", price: 2 },
    { name: "Strawberry", type: "Fruit", price: 1 },
    { name: "Vanilla", type: "Vanilla", price: 2 },
    { name: "Pistachio", type: "Nuts", price: 1.5 },
    { name: "Neapolitan", type: "Chocolate", price: 2},
    { name: "MintChip", type: "Chocolate", price: 1.5 },
    { name: "Raspberry", type: "Fruit", price: 1},
]; // {}은 아이스크림 정보를 모아 놓은 객체, []는 배열

let transactions = [] // 거래 내역 기록하는 배열
transactions.push({ scoops: ["Chocolate", "Vanilla", "MintChip"], total: 5.5 })
transactions.push({ scoops: ["Raspberry", "StrawBerry"], total: 2 })
transactions.push({ scoops: ["Vanilla", "Vanilla"], total: 4 })
// 거래한 맛(scoops)과 총액(total)을 배열에 추가(push)

const total = transactions.reduce((acc, curr) => acc + curr.total, 0);
console.log(`총 거래액 : ${total}`);
// transactions 배열의 모든 요소를 순회하며 하나의 값(total)으로 누적
// reduce : 축소
// (acc, curr) => : 콜백 함수, 배열의 각 항목마다 실행될 함수
// acc : 지금까지의 누적된 값(total)을 저장
// curr : 배열에서 현재 처리하는 항목
// 현재 누적 값(acc)에 현재 거래 객체의 total 값을 더하여 새로운 누적 값을 만들기

// 각 아이스크림 맛의 판매량 집계
let flavorDistribution = transactions.reduce((acc, curr) => {
curr.scoops.forEach(scoop => {
    if (!acc[scoop]) {
        acc[scoop] = 0;
    }
    acc[scoop]++;
    })
    return acc;
}, {})
console.log(flavorDistribution);
/*
flavorDistribution 변수에 저장되는 객체
{
  "Chocolate": 1,   // 첫 번째 거래에서 1번
  "Vanilla": 3,     // 첫 번째 거래에서 1번 + 세 번째 거래에서 2번
  "MintChip": 1,    // 첫 번째 거래에서 1번
  "Raspberry": 1,   // 두 번째 거래에서 1번
  "StrawBerry": 1   // 두 번째 거래에서 1번
}
*/

// 가장 많이 팔린 아이스크림 맛 찾아서 출력
const soldFlavors = Object.keys(flavorDistribution);
// Object.keys() 메서드로 키 값(아이스크림 맛)만 가져와서 soldFlavors 새로운 배열 만들기
console.log(soldFlavors);

// reduce()를 사용하여 가장 높은 판매량을 가진 맛 찾기
const mostPopularFlavor = soldFlavors.reduce((bestFlavor, currentFlavor) => {
    const bestCount = flavorDistribution[bestFlavor];
    const currentCount = flavorDistribution[currentFlavor];
    if (currentCount > bestCount) {
        return currentFlavor;
    } else {
        return bestFlavor;
    }
}, soldFlavors[0]);

console.log(`가장 많이 팔린 아이스크림 맛 : ${mostPopularFlavor}`);