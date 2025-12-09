const Messages = {
    KEY_EVENT_UP: "KEY EVENT UP",
    KEY_EVENT_DOWN: "KEY EVENT DOWN",
    KEY_EVENT_LEFT: "KEY EVENT LEFT",
    KEY_EVENT_RIGHT: "KEY EVENT RIGHT",
    KEY_EVENT_SPACE: "KEY EVENT SPACE",
    KEY_EVENT_ENTER: "KEY EVENT ENTER",
    COLLISION_ENEMY_LASER: "COLLISION ENEMY LASER",
    COLLISION_ENEMY_HERO: "COLLISION ENEMY HERO",
    GAME_END_LOSS: "GAME END LOSS",
    GAME_END_WIN: "GAME END WIN",
};

const KEY_STATUS = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let heroImg, enemyImg, laserImg, explosionImg, starBigImg, starSmallImg, lifeImg, ufoImg, bossLaserImg;
let canvas, ctx;
let gameObjects = [];
let hero;
let stars = [];
let particles = [];
let gameLoopId;
let bossIntervalId;
let wingmanIntervalId;
let hudIntervalId;
let lastTime = 0;
let isGameRunning = false;
let currentStage = 1;
const NUM_STARS = 100;

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
    clear() {
        this.listeners = {};
    }
}
let eventEmitter = new EventEmitter();

const UIManager = {
    logBox: null,
    elHpRing: null,
    elHpText: null,
    elWeapon: null,
    elWingL: null,
    elWingR: null,
    leftPanel: null,
    elEngine: null,

    init() {
        this.logBox = document.getElementById('battle-log');
        this.elHpRing = document.getElementById('hud-hp-ring');
        this.elHpText = document.getElementById('hud-hp-text');
        this.elWeapon = document.getElementById('hud-weapon');
        this.elWingL = document.getElementById('hud-wing-l');
        this.elWingR = document.getElementById('hud-wing-r');
        this.leftPanel = document.querySelector('.left-panel');
        this.elEngine = document.getElementById('hud-engine-val');
        
        setTimeout(() => this.addLog("> TACTICAL HUD ONLINE"), 1000);
    },

    addLog(text) {
        if (!this.logBox) return;
        const time = new Date().toLocaleTimeString().split(' ')[0];
        const newLine = document.createElement('div');
        newLine.innerHTML = `[${time}] ${text}`;
        
        if (this.logBox.children.length > 15) {
            this.logBox.removeChild(this.logBox.lastChild);
        }
        this.logBox.prepend(newLine);
    },

    setEngineStatus(status, color) {
        if (this.elEngine) {
            this.elEngine.innerText = status;
            this.elEngine.style.color = color || "inherit";
        }
    },

    update() {
        if (!hero) return;

        const maxLife = 3;
        let hpPercent = (hero.life / maxLife) * 100;
        if (hpPercent < 0) hpPercent = 0;

        if (this.elHpText) this.elHpText.innerText = Math.floor(hpPercent) + "%";

        let color = '#0f0';
        if (hero.life === 2) color = '#fc0';
        if (hero.life <= 1) color = '#f00';

        if (this.elHpRing) {
            this.elHpRing.style.background = `conic-gradient(${color} 0% ${hpPercent}%, #333 ${hpPercent}% 100%)`;
            this.elHpRing.style.boxShadow = `0 0 10px ${color}`;
        }

        if (hero.life <= 1 && hero.life > 0) {
            if (this.leftPanel) this.leftPanel.classList.add('panel-danger');
            if (this.elHpText) {
                this.elHpText.style.color = 'red';
                this.elHpText.style.textShadow = '0 0 5px red';
            }
        } else {
            if (this.leftPanel) this.leftPanel.classList.remove('panel-danger');
            if (this.elHpText) {
                this.elHpText.style.color = 'white';
                this.elHpText.style.textShadow = '0 0 5px #0f0';
            }
        }

        if (this.elWeapon) {
            if (hero.weaponLevel === 1) {
                this.elWeapon.innerText = "MK-1";
                this.elWeapon.style.color = "cyan";
            } else if (hero.weaponLevel === 2) {
                this.elWeapon.innerText = "MK-2";
                this.elWeapon.style.color = "orange";
            } else {
                this.elWeapon.innerText = "MK-3 (MAX)";
                this.elWeapon.style.color = "#f0f";
            }
        }

        if (this.elWingL) {
            if (hero.leftWingmanAlive) {
                this.elWingL.innerHTML = "■ ONLINE";
                this.elWingL.className = "status-ok";
            } else {
                this.elWingL.innerHTML = "□ LOST SIGNAL";
                this.elWingL.className = "status-lost";
            }
        }

        if (this.elWingR) {
            if (hero.rightWingmanAlive) {
                this.elWingR.innerHTML = "■ ONLINE";
                this.elWingR.className = "status-ok";
            } else {
                this.elWingR.innerHTML = "□ LOST SIGNAL";
                this.elWingR.className = "status-lost";
            }
        }
        
        if (Math.random() > 0.98) {
            this.addLog("> SCANNING SECTOR...");
        }
    }
};

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
        this.weaponLevel = 1;
        this.leftWingmanAlive = true;
        this.rightWingmanAlive = true;
    }
    canFire() {
        return this.cooldown === 0;
    }
    fire() {
        if (this.canFire()) {
            if (this.weaponLevel === 1) {
                gameObjects.push(new Laser(this.x + 45, this.y - 10));
            } 
            else if (this.weaponLevel === 2) {
                gameObjects.push(new Laser(this.x + 15, this.y - 10));
                gameObjects.push(new Laser(this.x + 75, this.y - 10));
            } 
            else {
                gameObjects.push(new Laser(this.x + 45, this.y - 20));
                let left = new Laser(this.x + 15, this.y - 10);
                left.vx = -100;
                gameObjects.push(left);
                let right = new Laser(this.x + 75, this.y - 10);
                right.vx = 100;
                gameObjects.push(right);
            }
            const rapidFire = this.weaponLevel > 1 ? 200 : 300;
            this.cooldown = rapidFire;
            let id = setInterval(() => {
                if (this.cooldown > 0) this.cooldown -= 100;
                else clearInterval(id);
            }, 100);
        }
    }
    decrementLife() {
        this.life--;
        this.weaponLevel = 1;
        if (this.life === 0) this.dead = true;
    }
    incrementPoints() {
        this.points += 100;
        if (this.points >= 2000) this.weaponLevel = 3;
        else if (this.points >= 1000) this.weaponLevel = 2;
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
        this.maxHealth = 3000;
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
        this.vx = 0;
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
        this.vx = 0;
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
        this.size = Math.random() * 4 + 1;
        this.vx = (Math.random() - 0.5) * 400;
        this.vy = (Math.random() - 0.5) * 400;
        this.life = 1.0;
    }
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life -= dt * 1.5;
    }
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

function createExplosionParticles(x, y, baseColor) {
    for (let i = 0; i < 60; i++) {
        let color = baseColor;
        const r = Math.random();
        if (r < 0.3) color = '#fff';
        else if (r < 0.6) color = '#ff0';
        particles.push(new Particle(x, y, color));
    }
}

function intersectRect(r1, r2) {
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
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
        if (KEY_STATUS.ArrowUp) hero.y -= speed * dt;
        if (KEY_STATUS.ArrowDown) hero.y += speed * dt;
        if (KEY_STATUS.ArrowLeft) hero.x -= speed * dt;
        if (KEY_STATUS.ArrowRight) hero.x += speed * dt;
    }

    gameObjects.forEach(go => {
        if (go.type === 'Boss') {
            go.x += go.speedX * go.direction * dt;
            if (go.x + go.width > canvas.width) {
                go.x = canvas.width - go.width;
                go.direction = -1;
            } else if (go.x < 0) {
                go.x = 0;
                go.direction = 1;
            }
        } 
        else if (go.type === 'Enemy') {
            go.y += 50 * dt;
            if (go.y > canvas.height) go.dead = true;
        } 
        else if (go.type === 'Laser' || go.type === 'BossLaser') {
            let laserSpeed = (go.type === 'BossLaser') ? 300 : (go instanceof SmallLaser) ? 200 : 150;
            if (go.vx) go.x += go.vx * dt;
            go.y += (go.type === 'BossLaser') ? laserSpeed * dt : -laserSpeed * dt;
            if (go.y < 0 || go.y > canvas.height) go.dead = true;
        }
    });

    const enemies = gameObjects.filter(go => go.type === 'Enemy' || go.type === 'Boss');
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    const bossLasers = gameObjects.filter((go) => go.type === "BossLaser");

    if (hero && hero.life > 0) {
        const heroRect = hero.rectFromGameObject();
        enemies.forEach(enemy => {
            if (intersectRect(heroRect, enemy.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
            }
        });
        bossLasers.forEach(bl => {
            if (intersectRect(heroRect, bl.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy: bl }); 
            }
        });
    }

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, { first: l, second: m });
            }
        });
    });

    if (hero && !hero.dead) {
        const smW = hero.width * 0.5;
        const smH = hero.height * 0.5;
        const leftRect = { left: hero.x - smW - 20, top: hero.y + (hero.height - smH) - 10, right: hero.x - 20, bottom: hero.y + hero.height - 10 };
        const rightRect = { left: hero.x + hero.width + 20, top: hero.y + (hero.height - smH) - 10, right: hero.x + hero.width + 20 + smW, bottom: hero.y + hero.height - 10 };
        const threats = gameObjects.filter(go => go.type === 'Enemy' || go.type === 'Boss' || go.type === 'BossLaser');

        threats.forEach(threat => {
            const tRect = threat.rectFromGameObject();
            if (hero.leftWingmanAlive && intersectRect(leftRect, tRect)) {
                hero.leftWingmanAlive = false; 
                createExplosionParticles(leftRect.left + smW/2, leftRect.top + smH/2, 'cyan');
                if (threat.type !== 'Boss') threat.dead = true;
            }
            if (hero.rightWingmanAlive && intersectRect(rightRect, tRect)) {
                hero.rightWingmanAlive = false;
                createExplosionParticles(rightRect.left + smW/2, rightRect.top + smH/2, 'cyan');
                if (threat.type !== 'Boss') threat.dead = true;
            }
        });
    }
    gameObjects = gameObjects.filter(go => !go.dead);
}

function drawText(message, x, y) {
    ctx.fillText(message, x, y);
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
        ctx.drawImage(lifeImg, START_POS + (45 * i), canvas.height - 37);
    }
}

function updateParticles(dt) {
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => p.life > 0);
}

function drawParticles(ctx) {
    particles.forEach(p => p.draw(ctx));
}

function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function endGame(win) {
    isGameRunning = false;
    cancelAnimationFrame(gameLoopId);
    if (bossIntervalId) clearInterval(bossIntervalId);
    if (wingmanIntervalId) clearInterval(wingmanIntervalId);
    if (hudIntervalId) clearInterval(hudIntervalId);
    
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (win) {
            displayMessage("Victory!!! Press [Enter] to start a new game", "green");
        } else {
            displayMessage("You died. Press [Enter] to start a new game");
        }
    }, 200);
}

function resetGame() {
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (bossIntervalId) clearInterval(bossIntervalId);
    if (wingmanIntervalId) clearInterval(wingmanIntervalId);
    if (hudIntervalId) clearInterval(hudIntervalId);

    eventEmitter.clear();
    currentStage = 1;

    if (hero) {
        hero.life = 3;
        hero.points = 0;
        hero.weaponLevel = 1;
        hero.leftWingmanAlive = true;
        hero.rightWingmanAlive = true;
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
        if (hero.canFire()) hero.fire();
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
            if (second.dead) eventEmitter.emit(Messages.GAME_END_WIN);
        } else {
            second.dead = true;
            if (isEnemiesDead()) {
                 if (currentStage < 3) nextStage();
                 else eventEmitter.emit(Messages.GAME_END_WIN);
            }
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (msg, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) eventEmitter.emit(Messages.GAME_END_LOSS);
    });

    eventEmitter.on(Messages.GAME_END_WIN, () => endGame(true));
    eventEmitter.on(Messages.GAME_END_LOSS, () => endGame(false));
    eventEmitter.on(Messages.KEY_EVENT_ENTER, () => resetGame());

    bossIntervalId = setInterval(() => {
        const boss = gameObjects.find(go => go.type === 'Boss' && !go.dead);
        if (boss) {
            const centerX = boss.x + boss.width / 2;
            const bottomY = boss.y + boss.height;
            gameObjects.push(new BossLaser(centerX - 7.5, bottomY));
            let leftShot = new BossLaser(centerX - 7.5, bottomY);
            leftShot.vx = -150;
            gameObjects.push(leftShot);
            let rightShot = new BossLaser(centerX - 7.5, bottomY);
            rightShot.vx = 150;
            gameObjects.push(rightShot);
        }
    }, 1000);

    wingmanIntervalId = setInterval(() => {
        if (!hero || hero.dead) return;
        const smallWidth = hero.width * 0.5;
        const smallHeight = hero.height * 0.5;
        if (hero.leftWingmanAlive) {
            const leftSmallX = hero.x - smallWidth - 20;
            const leftSmallY = hero.y + (hero.height - smallHeight) - 10;
            gameObjects.push(new SmallLaser(leftSmallX + smallWidth / 2 - 2.5, leftSmallY - 5));
        }
        if (hero.rightWingmanAlive) {
            const rightSmallX = hero.x + hero.width + 20;
            const rightSmallY = hero.y + (hero.height - smallHeight) - 10;
            gameObjects.push(new SmallLaser(rightSmallX + smallWidth / 2 - 2.5, rightSmallY - 5));
        }
    }, 500);

    hudIntervalId = setInterval(() => {
        UIManager.update();
    }, 100);
}

function drawWingmen(ctx) {
    if (!hero || hero.dead) return;
    const smallWidth = hero.width * 0.5;
    const smallHeight = hero.height * 0.5;
    if (hero.leftWingmanAlive) {
        const leftSmallX = hero.x - smallWidth - 20;
        const leftSmallY = hero.y + (hero.height - smallHeight) - 10;
        ctx.drawImage(heroImg, leftSmallX, leftSmallY, smallWidth, smallHeight);
    }
    if (hero.rightWingmanAlive) {
        const rightSmallX = hero.x + hero.width + 20;
        const rightSmallY = hero.y + (hero.height - smallHeight) - 10;
        ctx.drawImage(heroImg, rightSmallX, rightSmallY, smallWidth, smallHeight);
    }
}

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => resolve(img);
  })
}

window.simulateKey = function(keyType) {
    if (keyType === 'Enter') {
        const e = new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13 });
        window.dispatchEvent(e);
    } else if (keyType === 'Space') {
        const e = new KeyboardEvent('keydown', { key: ' ', keyCode: 32 });
        window.dispatchEvent(e);
        setTimeout(() => {
            const up = new KeyboardEvent('keyup', { key: ' ', keyCode: 32 });
            window.dispatchEvent(up);
        }, 100);
    }
}

window.onload = async() => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    UIManager.init();
    
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
        case 37: UIManager.addLog("> THRUSTERS: LEFT"); break;
        case 38: break;
        case 39: UIManager.addLog("> THRUSTERS: RIGHT"); break;
        case 40: break;
        case 32: 
            UIManager.addLog("> FIRING MAIN WEAPON");
            UIManager.setEngineStatus("MAX POWER", "#fff");
            break;
    }
    if ([37, 38, 39, 40, 32].includes(e.keyCode)) e.preventDefault();
    if (e.key in KEY_STATUS) KEY_STATUS[e.key] = true;
});

window.addEventListener("keyup", (evt) => {
    if (evt.key in KEY_STATUS) KEY_STATUS[evt.key] = false;
    if (evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
        UIManager.setEngineStatus("NORMAL", "inherit");
    } else if (evt.key === "Enter") {
        UIManager.addLog("> SYSTEM REBOOT COMMAND");
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
});