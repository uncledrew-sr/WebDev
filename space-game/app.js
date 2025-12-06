let heroImg, enemyImg, laserImg, backgroundImg, explosionImg, starBigImg, starSmallImg;
let canvas, ctx;
let gameObjects = [];
let hero;
let gameLoopId;

const KEY_STATUS = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const NUM_STARS = 100; 
let stars = [];

const Messages = {
    KEY_EVENT_UP: "KEY EVENT UP",
    KEY_EVENT_DOWN: "KEY EVENT DOWN",
    KEY_EVENT_LEFT: "KEY EVENT LEFT",
    KEY_EVENT_RIGHT: "KEY EVENT RIGHT",
    KEY_EVENT_SPACE: "KEY EVENT SPACE",
    COLLISION_ENEMY_LASER: "COLLISION ENEMY LASER",
    COLLISION_ENEMY_HERO: "COLLISION ENEMY HERO",

    GAME_END_LOSS: "GAME END LOSS",
    GAME_END_WIN: "GAME END WIN",
    KEY_EVENT_ENTER: "KEY EVENT ENTER",
};

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on (message, listener) {
        if (!this.listeners[message]) {
             this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit (message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
    clear() {
        this.listeners = {};
    }
}
let eventEmitter = new EventEmitter();

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = "";
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }
    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'Hero';
        this.cooldown = 0;
        this.life = 3; 
        this.points = 0;
    }
    canFire() {
        return this.cooldown === 0;
    }
    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10));

            this.cooldown = 500;
            
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);
                }
            }, 100);
        }
    }
    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
    }
    incrementPoints() {
        this.points += 100;
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 9;
        this.height = 33;
        this.type = 'Laser';
        this.img = laserImg;
    }
}

class SmallLaser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 5;
        this.height = 20;
        this.type = 'Laser';
        this.img = laserImg;
    }
}

class Explosion extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 100;
        this.height = 100;
        this.type = 'Explosion';
        this.img = explosionImg;
        
        setTimeout(() => {
            this.dead = true;
        }, 300); 
    }
}

function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function createEnemies() {
  const TOTAL_ROWS = 5;
  const TOTAL_COLS = 5;
  const ENEMY_WIDTH = 98;
  const ENEMY_HEIGHT = 50;
  
  const FORMATION_WIDTH = TOTAL_COLS * ENEMY_WIDTH;
  const START_X = (canvas.width - FORMATION_WIDTH) / 2;
  const START_Y = 0;

  for (let r = 0; r < TOTAL_ROWS; r++) {
    for (let c = 0; c < TOTAL_COLS; c++) {
      
      const x = START_X + c * ENEMY_WIDTH;
      const y = START_Y + r * ENEMY_HEIGHT;
      
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}

function createStars() {
    for (let i = 0; i < NUM_STARS; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height, 
            speed: Math.random() * 2 + 1, 
            img: Math.random() > 0.5 ? starBigImg : starSmallImg, 
            size: Math.random() * 1.5 + 1.5
        });
    }
}

function drawStars(ctx) {
    stars.forEach(star => {
        ctx.drawImage(star.img, star.x, star.y, star.size, star.size); 
    });
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function createHero() {
    const x = canvas.width / 2 - 45;
    const y = canvas.height - (canvas.height / 4);

    hero = new Hero(x, y);
    hero.img = heroImg;
    gameObjects.push(hero);
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function updateGameObjects() {
    const speed = 20;

    if (hero) {
        if (KEY_STATUS.ArrowUp) {
            hero.y -= speed;
        }
        if (KEY_STATUS.ArrowDown) {
            hero.y += speed;
        }
        if (KEY_STATUS.ArrowLeft) {
            hero.x -= speed;
        }
        if (KEY_STATUS.ArrowRight) {
            hero.x += speed;
        }
    }

    gameObjects.forEach(go => {
        if (go.type === 'Enemy') {
            go.y += 5;
            if (go.y > canvas.height) { 
                go.dead = true;
            }
        } else if (go.type === 'Laser') {
            go.y -= 15;
            if (go.y < 0) {
                go.dead = true;
            }
        }
    });

    const enemies = gameObjects.filter(go => go.type === 'Enemy');
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    if (hero && hero.life > 0) {
        enemies.forEach(enemy => {
            const heroRect = hero.rectFromGameObject();
            if (intersectRect (heroRect, enemy.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
            }
        });
    }

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });
    gameObjects = gameObjects.filter(go => !go.dead);
}

function drawText (message, x, y) {
    ctx.fillText (message, x, y);
}

function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Score: " + hero.points, 10, canvas.height - 20);
}

function drawLife() {
    if (!hero || !lifeImg) return;
    const START_POS = canvas.width - 180;
    for(let i = 0; i < hero.life; i++ ) {
        ctx.drawImage(
            lifeImg,
            START_POS + (45 * i),
            canvas.height - 37
        );
    }
}

function displayMessage (message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText (message, canvas.width / 2, canvas.height / 2);
}

function endGame (win) {
    clearInterval (gameLoopId);
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (win) {
            displayMessage(
                "Victory!!! Press [Enter] to start a new game",
                "green"
            );
        } else {
            displayMessage(
                "You died. Press [Enter] to start a new game"
            );
        }
    }, 200);
}

function resetGame() {
    if (gameLoopId) {
        clearInterval(gameLoopId); 
    }
    eventEmitter.clear(); 
    initGame(); 
    gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        updateStars();
        drawStars(ctx);
        updateGameObjects();
        drawGameObjects(ctx);
        drawWingmen(ctx);
        
        drawPoints();
        drawLife();

    }, 100);
}

function isHeroDead() {
    return hero.life <= 0;
}
function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemies.length === 0;
}

function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();
    createStars();

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (msg, { first, second }) => {
        first.dead = true;
        second.dead = true;
        hero.incrementPoints();

        const explosionX = second.x + second.width / 2 - 50; 
        const explosionY = second.y + second.height / 2 - 50;
        gameObjects.push(new Explosion(explosionX, explosionY));

        if (isEnemiesDead()) {
             eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (msg, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        
        if (isHeroDead()) {
             eventEmitter.emit(Messages.GAME_END_LOSS);
        }
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true);
    });
    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false);
    });
    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
        resetGame();
    });

    setInterval(() => {
        if (!hero) return;

        const smallWidth = hero.width * 0.5;
        const smallHeight = hero.height * 0.5;
        
        const leftSmallX = hero.x - smallWidth - 20;
        const leftSmallY = hero.y + (hero.height - smallHeight) - 10;
        gameObjects.push(new SmallLaser(leftSmallX + smallWidth / 2 - 2.5, leftSmallY - 5));

        const rightSmallX = hero.x + hero.width + 20;
        const rightSmallY = hero.y + (hero.height - smallHeight) - 10;
        gameObjects.push(new SmallLaser(rightSmallX + smallWidth / 2 - 2.5, rightSmallY - 5));

    }, 1000);
}

function drawWingmen(ctx) {
    const smallWidth = hero.width * 0.5;
    const smallHeight = hero.height * 0.5;

    const mainX = hero.x; 
    const mainY = hero.y; 

    const leftSmallX = mainX - smallWidth - 20;
    const leftSmallY = mainY + (hero.height - smallHeight) - 10;
    ctx.drawImage(heroImg, leftSmallX, leftSmallY, smallWidth, smallHeight); 

    const rightSmallX = mainX + hero.width + 20;
    const rightSmallY = mainY + (hero.height - smallHeight) - 10;
    ctx.drawImage(heroImg, rightSmallX, rightSmallY, smallWidth, smallHeight); 
}

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
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    
    heroImg = await loadTexture('assets/player.png');
    enemyImg = await loadTexture('assets/enemyShip.png');
    laserImg = await loadTexture('assets/laserRed.png');
    explosionImg = await loadTexture('assets/collision.png');
    starBigImg = await loadTexture('assets/background/starBig.png');
    starSmallImg = await loadTexture('assets/background/starSmall.png');
    lifeImg = await loadTexture('assets/life.png');

    initGame();

    gameLoopId = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      updateStars(); 
      drawStars(ctx); 

      updateGameObjects();
      drawGameObjects(ctx);
      drawWingmen(ctx);

      drawPoints();
      drawLife();
    }, 100);
};

let onKeyDown = function (e) {
    switch (e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
        case 32:
            e.preventDefault();
            break;
        default:
            break;
    }
};

window.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
        case 32:
            e.preventDefault(); 
            break;
    }
    if (e.key in KEY_STATUS) {
        KEY_STATUS[e.key] = true;
    }
});

window.addEventListener("keyup", (evt) => {
    if (evt.key in KEY_STATUS) {
          KEY_STATUS[evt.key] = false;
    }
    if (evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    } else if (evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
});