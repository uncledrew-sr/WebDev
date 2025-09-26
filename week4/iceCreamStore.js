let iceCreamFlavors = [
    { name: "Chocolate", type: "Chocolate", price: 2 },
    { name: "Strawberry", type: "Fruit", price: 1 },
    { name: "Vanilla", type: "Vanilla", price: 2 },
    { name: "Pistachio", type: "Nuts", price: 1.5 },
    { name: "Neapolitan", type: "Chocolate", price: 2},
    { name: "MintChip", type: "Chocolate", price: 1.5 },
    { name: "Raspberry", type: "Fruit", price: 1},
];
// { scoops: [], total: }
let transactions = []
// { scoops: [], total: }
transactions.push({ scoops: ["Chocolate", "Vanilla", "MintChip"], total: 5.5 })
transactions.push({ scoops: ["Raspberry", "StrawBerry"], total: 2 })
transactions.push({ scoops: ["Vanilla", "Vanilla"], total: 4 })
// 수익 계산
const total = transactions.reduce((acc, curr) => acc + curr.total, 0);
console.log(`You've made ${total} $ today`); // You've made 11.5 $ toda

// 각 맛의 판매량
let flavorDistribution = transactions.reduce((acc, curr) => {
curr.scoops.forEach(scoop => {
    if (!acc[scoop]) {
        acc[scoop] = 0;
    }
    acc[scoop]++;
    })
    return acc;
}, {}) // { Chocolate: 1, Vanilla: 3, MintChip: 1, Raspberry: 1, StrawBerry: 1 }
console.log(flavorDistribution);

// 가장 많이 팔린 아이스크림 맛 찾아서 출력
const soldFlavors = Object.keys(flavorDistribution); // Object.keys() 메서드로 키 값(아이스크림 맛) 가져오기
console.log(soldFlavors);
// reduce()를 사용하여 가장 높은 판매량을 가진 맛 찾기
const mostPopularFlavor = soldFlavors.reduce((bestFlavor, currentFlavor) => {
    // bestFlavor와 currentFlavor는 '맛 이름'(문자열)
    // flavorDistribution에서 해당 맛의 판매량을 가져와 비교
    const bestCount = flavorDistribution[bestFlavor];
    const currentCount = flavorDistribution[currentFlavor];
    // 현재 맛의 판매량이 더 높으면 currentFlavor를 반환
    if (currentCount > bestCount) {
        return currentFlavor;
    } else {
        return bestFlavor;
    }
}, soldFlavors[0]);

console.log(`가장 많이 팔린 아이스크림 맛: ${mostPopularFlavor}`);