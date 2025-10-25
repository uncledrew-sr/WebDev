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
// 복사본 생성 유틸리티 함수
function createCopy(originalElement) {
    const newPlant = originalElement.cloneNode(true);

    const uniqueId = originalElement.id + '_copy_' + Date.now();
    newPlant.id = uniqueId;

    newPlant.style.position = 'absolute';
    newPlant.style.zIndex = 200;
    
    document.body.appendChild(newPlant);
    
    return newPlant;
}

function dragElement(terrariumElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const isCopy = terrariumElement.id && terrariumElement.id.includes('_copy');

    if (terrariumElement.closest('.plant-holder')) {
        // 1. 원본 (사이드바 메뉴)
        terrariumElement.onpointerdown = handleOriginalDragStart; // 드래그 시작 시 복사본 생성
        terrariumElement.ondblclick = teleportPlantToJar;         // 더블 클릭 시 복사본 생성 및 텔레포트
        terrariumElement.onclick = null; // 혹시 모를 단순 클릭 충돌 방지
    } else if (isCopy) {
        // 2. 복사본 (테라리움 내부)
        terrariumElement.onpointerdown = pointerDrag;   // 드래그 가능
        terrariumElement.ondblclick = bringToFront;     // 더블 클릭 시 최상단으로
        terrariumElement.onclick = null;
    }
    /*
    if (terrariumElement.closest('.plant-holder')) {
        // 원본 드래그 시작(복사본 생성) 및 더블 클릭(텔레포트)
        terrariumElement.onpointerdown = handleOriginalDragStart;
        terrariumElement.ondblclick = teleportPlantToJar; 
    } else if (isCopy) {
        // 복사본 드래그 가능, 더블 클릭 시 최상단으로 이동
        terrariumElement.onpointerdown = pointerDrag;
        terrariumElement.ondblclick = bringToFront; 
    }
    */
    
    function pointerDrag(e) {
        e.preventDefault();
        // console.log(e);
        
        if (isCopy) {
            terrariumElement.style.zIndex = 100;
        }
        /*
        if (terrariumElement.id && terrariumElement.id.includes('_copy')) {
            terrariumElement.style.zIndex = 100;
        }
        */

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
        // console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
    }
    function stopElementDrag() {
        document.onpointerup = null;
        document.onpointermove = null;
    }
    function bringToFront(e) {
        e.preventDefault();

        document.querySelectorAll('.plant').forEach(plant => {
            if (plant.id && plant.id.includes('_copy')) {
                 plant.style.zIndex = 10;
            }
        });
        terrariumElement.style.zIndex = 200;
        console.log(`${terrariumElement.id} brought to front`);
    }
    function handleOriginalDragStart(e) {
        e.preventDefault();

        const newPlant = createCopy(terrariumElement);

        const offset = newPlant.offsetWidth / 2;
        newPlant.style.top = (e.clientY - offset) + 'px';
        newPlant.style.left = (e.clientX - offset) + 'px';
        dragElement(newPlant);
        if (newPlant.onpointerdown) {
            newPlant.onpointerdown(e);
        }
    }
    function teleportPlantToJar(e) {
        e.preventDefault();
        const newPlant = createCopy(terrariumElement);
        const terrariumCenterLeft = window.innerWidth / 2; 
        const plantWidth = 120;
        const targetLeft = terrariumCenterLeft - (plantWidth / 2); 
        const targetTop = 500; 
        
        newPlant.style.top = targetTop + 'px';
        newPlant.style.left = targetLeft + 'px';
        
        dragElement(newPlant);
        
        console.log(`Plant ${newPlant.id} teleported by double-click to the jar.`);

        if (terrariumElement.closest('.plant-holder')) {
            terrariumElement.onpointerdown = handleOriginalDragStart;
            terrariumElement.ondblclick = teleportPlantToJar;
        } else if (isCopy) {
            terrariumElement.onpointerdown = pointerDrag;
            terrariumElement.ondblclick = bringToFront;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.plant').forEach(plantElement => {
        if (!plantElement.id) {
            const tempId = `temp_plant_${Math.random().toString(36).substring(2, 9)}`;
            plantElement.id = tempId;
            console.warn(`Plant element found without ID. Assigned temporary ID: ${tempId}`);
        }
        
        dragElement(plantElement); 
    });

    console.log('Terrarium initialized. Double-click on sidebar plant to teleport, or drag to copy.');
});