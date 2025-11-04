/*
console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));

function dragElement(terrariumElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  terrariumElement.onpointerdown = pointerDrag;

  terrariumElement.ondblclick = bringToFront;

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

    terrariumElement.style.zIndex = 10;
  }

  function stopElementDrag() {
    document.onpointerup = null;
    document.onpointermove = null;

    terrariumElement.style.zIndex = 2;
  }
  
  function bringToFront() {
    terrariumElement.style.zIndex = 10;
  }
}
*/

// Drag and Drop API
const plants = document.querySelectorAll('.plant');
const terrarium = document.getElementById('terrarium');

let draggedPlantId = null;

plants.forEach(plant => {
    plant.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);

        draggedPlantId = e.target.id;
        
        e.target.style.zIndex = 10; 

        const offset = {
            x: e.clientX - e.target.getBoundingClientRect().left,
            y: e.clientY - e.target.getBoundingClientRect().top
        };
        e.dataTransfer.setData('application/json', JSON.stringify(offset));
    });

    plant.addEventListener('dragend', (e) => {
        e.target.style.zIndex = 2;
        draggedPlantId = null; 
    });
});

terrarium.addEventListener('dragover', (e) => {
    e.preventDefault();
});

terrarium.addEventListener('drop', (e) => {
    e.preventDefault();

    const plantId = e.dataTransfer.getData('text/plain');
    const offset = JSON.parse(e.dataTransfer.getData('application/json'));
    const plant = document.getElementById(plantId);
    
    const terrariumRect = terrarium.getBoundingClientRect();
    
    let newLeft = e.clientX - terrariumRect.left - offset.x;
    let newTop = e.clientY - terrariumRect.top - offset.y;

    if (plant.parentNode !== document.body) {
        document.body.appendChild(plant);
    }
    
    plant.style.position = 'absolute';
    plant.style.left = `${newLeft}px`;
    plant.style.top = `${newTop}px`;
    plant.style.zIndex = 2;
});