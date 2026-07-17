    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    // Objekt
    const ball = { x: 300, y: 200, radius: 10, speed: 4, dx: 4, dy: 4 };
    const player = { x: 0, y: 150, w: 10, h: 100, score: 0 };
    const cpu = { x: canvas.width - 10, y: 150, w: 10, h: 100, score: 0 };

    // Styr spelaren med musen
    canvas.addEventListener("mousemove", (e) => {
        let rect = canvas.getBoundingClientRect();
        player.y = e.clientY - rect.top - player.h / 2;
    });

    function drawRect(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    function drawCircle(x, y, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx *= -1; // Skicka bollen till den som precis vann
        ball.speed = 4;
    }

    function update() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Studsa mot tak och golv
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        // CPU AI (enkel rörelse som följer bollen)
        cpu.y += (ball.y - (cpu.y + cpu.h / 2)) * 0.1;

        // Kolla vilken paddel bollen är nära
        let activePaddle = (ball.x < canvas.width / 2) ? player : cpu;

        // Studsa mot paddlar
        if (collision(ball, activePaddle)) {
            ball.dx *= -1;
            ball.speed += 0.2; // Gör det svårare efter varje studs
        }

        // Poäng
        if (ball.x - ball.radius < 0) {
            cpu.score++;
            document.getElementById("cpuScore").textContent = cpu.score;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            player.score++;
            document.getElementById("playerScore").textContent = player.score;
            resetBall();
        }
    }

    function collision(b, p) {
        return b.x + b.radius > p.x && b.x - b.radius < p.x + p.w &&
               b.y + b.radius > p.y && b.y - b.radius < p.y + p.h;
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mittenlinje
        for(let i=0; i<canvas.height; i+=40) {
            drawRect(canvas.width/2 - 1, i, 2, 20, "white");
        }

        drawRect(player.x, player.y, player.w, player.h, "white");
        drawRect(cpu.x, cpu.y, cpu.w, cpu.h, "white");
        drawCircle(ball.x, ball.y, ball.radius, "yellow");
    }

    setInterval (function() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}, 1000 / 60);

gameLoop();