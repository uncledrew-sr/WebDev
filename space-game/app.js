let heroImg, enemyImg, laserImg, explosionImg, starBigImg, starSmallImg, lifeImg, ufoImg, bossLaserImg;
let canvas, ctx;
let gameObjects = [];
let hero;

let gameLoopId;
let bossIntervalId;
let wingmanIntervalId;
let lastTime = 0;
let isGameRunning = false;

const KEY_STATUS = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

const NUM_STARS = 100; 
let stars = [];
let particles = [];
let currentStage = 1;

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

class Boss extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.width = 200;
        this.height = 100;
        this.type = 'Boss';
        this.maxHealth = 1000;
        this.health = this.maxHealth;
        this.img = ufoImg;
        this.speedX = 200;
        this.direction = 1;
    }
    takeDamage(points) {
        this.health -= points;
        if (this.health <= 0) {
            this.dead = true;
        }
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

class BossLaser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 15;
        this.height = 40;
        this.type = 'BossLaser';
        this.img = bossLaserImg;
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

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 3 + 2;
        
        this.vx = (Math.random() - 0.5) * 300;
        this.vy = (Math.random() - 0.5) * 300;
        
        this.life = 1.0;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.life -= dt * 2.0; 
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
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

function nextStage() {
    currentStage++;
    if (currentStage > 3) {
        eventEmitter.emit(Messages.GAME_END_WIN);
    } else {
        startStage(currentStage);
    }
}

function startStage(stage) {
    gameObjects = [];
    if (hero) {
        hero.x = canvas.width / 2 - 45;
        hero.y = canvas.height - (canvas.height / 4);
        hero.dead = false;
        gameObjects.push(hero);
    } else {
        createHero();
    }
    createStars();
    createStageObjects(stage);
}

function createStageObjects(stage) {
    if (stage === 1) {
        const TOTAL_ROWS = 3; 
        const TOTAL_COLS = 3; 
        const ENEMY_WIDTH = 98;
        const ENEMY_HEIGHT = 50;

        const FORMATION_WIDTH = TOTAL_COLS * ENEMY_WIDTH;
        const START_X = (canvas.width - FORMATION_WIDTH) / 2;
        const START_Y = 50; 

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
    else if (stage === 2) {
        const TOTAL_ROWS = 5; 
        const TOTAL_COLS = 3; 
        const ENEMY_WIDTH = 98;
        const ENEMY_HEIGHT = 50;

        const FORMATION_WIDTH = TOTAL_COLS * ENEMY_WIDTH;
        const START_X = (canvas.width - FORMATION_WIDTH) / 2;
        const START_Y = 50; 

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
    else if (stage === 3) {
        const bossX = canvas.width / 2 - 100;
        const bossY = 50;
        const boss = new Boss(bossX, bossY);
        gameObjects.push(boss);
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

function updateStars(dt) {
    stars.forEach(star => {
        star.y += star.speed * 30 * dt;

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

function updateGameObjects(dt) {
    const speed = 200;

    if (hero) {
        if (KEY_STATUS.ArrowUp) {
            hero.y -= speed * dt;
        }
        if (KEY_STATUS.ArrowDown) {
            hero.y += speed * dt;
        }
        if (KEY_STATUS.ArrowLeft) {
            hero.x -= speed * dt;
        }
        if (KEY_STATUS.ArrowRight) {
            hero.x += speed * dt;
        }
    }

    gameObjects.forEach(go => {
        if (go.type === 'Boss') {
            go.x += go.speedX * go.direction * dt;

            if (go.x + go.width > canvas.width) {
                go.x = canvas.width - go.width;
                go.direction = -1;
            }
            else if (go.x < 0) {
                go.x = 0;
                go.direction = 1;
            }
        } 
        else if (go.type === 'Enemy') {
            go.y += 50 * dt;
            if (go.y > canvas.height) { 
                go.dead = true;
            }
        } 
        else if (go.type === 'Laser' || go.type === 'BossLaser') {
            let laserSpeed = (go.type === 'BossLaser') ? 200 :
                             (go instanceof SmallLaser) ? 200 : 150;

            go.y += (go.type === 'BossLaser') ? laserSpeed * dt : -laserSpeed * dt;
            
            if (go.y < 0 || go.y > canvas.height) {
                go.dead = true;
            }
        }
    });

    const enemies = gameObjects.filter(go => go.type === 'Enemy' || go.type === 'Boss');
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    if (hero && hero.life > 0) {
        enemies.forEach(enemy => {
            const heroRect = hero.rectFromGameObject();
            if (intersectRect (heroRect, enemy.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
            }
        });
        lasers.filter(l => l.type === 'BossLaser').forEach(bl => {
            if (intersectRect(hero.rectFromGameObject(), bl.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy: bl }); 
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

function createExplosionParticles(x, y, color) {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function updateParticles(dt) {
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => p.life > 0);
}

function drawParticles(ctx) {
    particles.forEach(p => p.draw(ctx));
}

function displayMessage (message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText (message, canvas.width / 2, canvas.height / 2);
}

function endGame (win) {
    isGameRunning = false;
    cancelAnimationFrame(gameLoopId);
    
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
        cancelAnimationFrame(gameLoopId); 
    }

    if (bossIntervalId) clearInterval(bossIntervalId);
    if (wingmanIntervalId) clearInterval(wingmanIntervalId);

    eventEmitter.clear();
    currentStage = 1;

    if (hero) {
        hero.life = 3;
        hero.points = 0;
    }

    initGame();

    isGameRunning = true;
    lastTime = performance.now(); 
    gameLoopId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    let dt = (timestamp - lastTime) / 1000;
    if (isNaN(dt)) dt = 0;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    updateStars(dt);
    drawStars(ctx); 

    updateGameObjects(dt);

    updateParticles(dt); 
    drawParticles(ctx);

    drawGameObjects(ctx);
    drawWingmen(ctx);

    drawPoints();
    drawLife();

    gameLoopId = requestAnimationFrame(gameLoop);
}

function isHeroDead() {
    return hero.life <= 0;
}
function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => (go.type === "Enemy" || go.type === "Boss") && !go.dead);
    return enemies.length === 0;
}

function initGame() {
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (msg, { first, second }) => {
        first.dead = true;
        hero.incrementPoints();

        const explosionX = second.x + second.width / 2;
        const explosionY = second.y + second.height / 2;
        gameObjects.push(new Explosion(explosionX - 50, explosionY - 50));

        let explosionColor = second.type === 'Boss' ? 'yellow' : 'orange';
        createExplosionParticles(explosionX, explosionY, explosionColor);

        if (second.type === 'Boss') {
            second.takeDamage(100); 
            if (second.dead) {
                eventEmitter.emit(Messages.GAME_END_WIN);
            }
        } else {
            second.dead = true;
            if (isEnemiesDead()) {
                 if (currentStage < 3) {
                     nextStage();
                 } else {
                     eventEmitter.emit(Messages.GAME_END_WIN);
                 }
            }
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

    bossIntervalId = setInterval(() => {
        const boss = gameObjects.find(go => go.type === 'Boss' && !go.dead);
        if (boss) {
            gameObjects.push(new BossLaser(boss.x + boss.width / 2 - 7.5, boss.y + boss.height));
        }
    }, 1500);

    wingmanIntervalId = setInterval(() => {
        if (!hero || hero.dead) return;

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
    ufoImg = await loadTexture('assets/enemyUFO.png');
    bossLaserImg = await loadTexture('assets/laserGreen.png');

    initGame();
    startStage(1);

    isGameRunning = true;
    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
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