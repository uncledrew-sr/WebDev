function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  })
}

window.onload = async() => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const backgroundImg = await loadTexture('assets/background/starBackground.png');
  const pattern = ctx.createPattern(backgroundImg, 'repeat');
  const heroImg = await loadTexture('assets/player.png')
  const enemyImg = await loadTexture('assets/enemyShip.png')
  
  // ctx.fillStyle = 'black';
  // ctx.fillRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);  

  // ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  const mainX = canvas.width/2 - 45;
  const mainY = canvas.height - (canvas.height/4);

  ctx.drawImage(heroImg, mainX, mainY);

  const smallWidth = heroImg.width * 0.5;
  const smallHeight = heroImg.height * 0.5;

  const leftSmallX = mainX - smallWidth - 20;
  const leftSmallY = mainY + (heroImg.height - smallHeight) - 10;

  const rightSmallX = mainX + heroImg.width + 20;
  const rightSmallY = mainY + (heroImg.height - smallHeight) - 10;
  
  ctx.drawImage(heroImg, leftSmallX, leftSmallY, smallWidth, smallHeight);
  ctx.drawImage(heroImg, rightSmallX, rightSmallY, smallWidth, smallHeight);

  createEnemies2(ctx, canvas, enemyImg);
};

function createEnemies(ctx, canvas, enemyImg) {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;
  for (let x = START_X; x < STOP_X; x += enemyImg.width) {
    for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
      ctx.drawImage(enemyImg, x, y);
    }
  }
}

function createEnemies2(ctx, canvas, enemyImg){
  const NUM_ROWS = 5;
  
  for (let r = 0; r < NUM_ROWS; r++) {
    const enemiesInRow = NUM_ROWS - r; 
    const rowWidth = enemiesInRow * enemyImg.width;
    const startX = (canvas.width - rowWidth) / 2;
    const currentY = r * enemyImg.height; 
    for (let c = 0; c < enemiesInRow; c++) {
      const currentX = startX + c * enemyImg.width;
      ctx.drawImage(enemyImg, currentX, currentY);
    }
  }
}