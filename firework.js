const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

// Container
class Birthday {
    constructor() {
        this.resize();

        // Firework Local
        this.fireworks = [];
        this.counter = 0;
    }

    resize() {
        this.width = canvas.width = window.innerWidth;
        let center = this.width / 2 | 0;
        this.spawnA = center - center / 4 | 0;
        this.spawnB = center + center / 4 | 0;

        this.height = canvas.height = window.innerHeight;
        this.spawnC = this.height * 0.1;
        this.spawnD = this.height * 0.5;
    }

    onClick(evt) {
        console.log('Creating fireworks...');
        let x = evt.clientX || evt.touches && evt.touches[0].pageX;
        let y = evt.clientY || evt.touches && evt.touches[0].pageY;

        let count = random(2, 4);
        for (let i = 0; i < count; i++) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                x,
                y,
                random(0, 260),
                random(30, 110)
            ));
        }

        this.counter = -1;
    }

    update(delta) {
        ctx.globalCompositeOperation = 'hard-light';
        ctx.fillStyle = `rgba(20, 20, 20, ${7 * delta})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.globalCompositeOperation = 'lighter';
        for (let firework of this.fireworks) {
            firework.update(delta, this);
        }

        this.counter += delta * 3; // each second
        if (this.counter >= 1) {
            this.fireworks.push(new Firework(
                random(this.spawnA, this.spawnB),
                this.height,
                random(0, this.width),
                random(this.spawnC, this.spawnD),
                random(0, 360),
                random(30, 110)
            ));
            this.counter = 0;
        }

        // Remover os outros Fireworks
        if (this.fireworks.length > 1080) {
            this.fireworks = this.fireworks.filter(firework => !firework.dead);
        }
    }
}

class Firework {
    constructor(x, y, targetX, targetY, shade, offsprings) {
        this.dead = false;
        this.offsprings = offsprings;

        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;

        this.shade = shade;
        this.history = [];
    }

    update(delta, birthday) {
        if (this.dead) return;

        let xDiff = this.targetX - this.x;
        let yDiff = this.targetY - this.y;

        if (Math.abs(xDiff) < 3 && Math.abs(yDiff) < 3) {
            this.dead = true;
            this.explode(birthday);
        } else {
            this.x += xDiff * 2.5 * delta;
            this.y += yDiff * 2.5 * delta;
            this.history.push({ x: this.x, y: this.y });

            // Manter um histórico limitado de posições
            if (this.history.length > 15) {
                this.history.shift(); // Remove a posição mais antiga
            }
        }
    }

    explode(birthday) {
        const count = this.offsprings;
        for (let i = 0; i < count; i++) {
            const firework = new Firework(
                this.x,
                this.y,
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                this.shade,
                0
            );

            firework.velocities = {
                x: Math.random() * 5 - 2.5,
                y: Math.random() * 5 - 2.5,
            };

            birthday.fireworks.push(firework);
        }
    }

    draw() {
        if (this.dead) return;

        // Desenhar o rastro apenas se o firework não estiver explodido
        if (this.history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.history[0].x, this.history[0].y);

            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }

            ctx.strokeStyle = `hsla(${this.shade}, 100%, 50%, 0.3)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Desenhar a bola no topo do rastro
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, PI2);
        ctx.fillStyle = `hsl(${this.shade}, 100%, 50%)`;
        ctx.fill();
    }

}



class Particle {
    constructor(x, y, shade, velocities) {
        this.x = x;
        this.y = y;
        this.shade = shade;
        this.velocities = velocities;
        this.alpha = 1;
    }

    update(delta) {
        if (this.alpha <= 0) return;
        this.velocities.x += Math.random() * 0.2 - 0.1;
        this.velocities.y += Math.random() * 0.2 - 0.1;
        this.x += this.velocities.x;
        this.y += this.velocities.y;
        this.alpha -= delta * 0.02;
    }

    draw() {
        if (this.alpha <= 0) return;

        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, PI2);
        ctx.fillStyle = `hsl(${this.shade}, 100%, 50%)`;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let canvas = document.getElementById('birthday');
let ctx = canvas.getContext('2d');

let then = timestamp();

let birthday = new Birthday();

// Correção: Vinculando a função correta ao evento de clique no canvas
canvas.onclick = evt => {
    console.log('Canvas click detected.');
    birthday.onClick(evt);
};
canvas.ontouchstart = evt => {
    console.log('Canvas touch detected.');
    birthday.onClick(evt);
};

function loop() {
    requestAnimationFrame(loop);

    let now = timestamp();
    let delta = now - then;

    then = now;
    birthday.update(delta / 1500, birthday);  // Passa a referência de birthday para update

    // Remover fogos de artifício finalizados
    birthday.fireworks = birthday.fireworks.filter(firework => !firework.dead);

    // Desenhar fogos de artifício ativos
    ctx.clearRect(0, 0, birthday.width, birthday.height);
    ctx.globalCompositeOperation = 'lighter';
    for (let firework of birthday.fireworks) {
        firework.draw();
    }
}

loop();
