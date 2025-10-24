// DOM 요소 지정하는 loop
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 14; i++) {
        const plantId = 'plant' + i;
        const plantElement = document.getElementById(plantId);
        if (plantElement) {
            dragElement(plantElement); // dragElement 함수 호출
        } else {
            console.warn(`${plantId} not found.`);
        }
    }
});

function dragElement(terrariumElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    terrariumElement.onpointerdown = pointerDrag;
    terrariumElement.ondblclick = bringToFront; // 더블 클릭 이벤트 핸들러

    function pointerDrag(e) {
        e.preventDefault();
        console.log(e);
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }
    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }
    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }
    function bringToFront() {
        document.querySelectorAll('.plant').forEach(plant => {
            plant.style.zIndex = 2;
        });
        // 더블 클릭된 요소(terrariumElement)만 최상단으로 설정
        terrariumElement.style.zIndex = 100;
        console.log(`${terrariumElement.id} brought to front`);
    }
}