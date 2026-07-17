    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("highScore");

    // --- FYSIK-INSTÄLLNINGAR (Långsamt och bra) ---
    let bird = { x: 50, y: 200, w: 20, h: 20, gravity: 0.18, lift: -4.5, velocity: 0 };
    let pipes = [];
    let frameCount = 0;
    let score = 0;
    let gameStarted = false;

    // Hämta Highscore
    let highScore = localStorage.getItem("birdHighScore") || 0;
    highScoreElement.textContent = highScore;

    function jump() {
        if (!gameStarted) {
            gameStarted = true;
        }
        bird.velocity = bird.lift;
    }

    document.addEventListener("keydown", (e) => { if (e.code === "Space") jump(); });
    canvas.addEventListener("mousedown", jump);

    function draw() {
        ctx.fillStyle = "#70c5ce";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.fillStyle = "white";
            ctx.font = "18px 'Courier New'";
            ctx.fillText("KLICKA FÖR ATT STARTA", 45, canvas.height / 2);
            drawBird();
            requestAnimationFrame(draw);
            return;
        }

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        drawBird();

        // Skapa rör
        if (frameCount % 130 === 0) { 
            let gap = 160; 
            let topHeight = Math.random() * (canvas.height - gap - 100) + 50;
            // Lade till 'passed: false' för att hålla koll på poängen
            pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap, passed: false });
        }

        ctx.fillStyle = "#2ecc71";
        pipes.forEach((p) => {
            p.x -= 1.3; 
            
            ctx.fillRect(p.x, 0, 50, p.top);
            ctx.fillRect(p.x, p.bottom, 50, canvas.height - p.bottom);

            // Kolla kollision
            if (bird.x < p.x + 50 && bird.x + bird.w > p.x &&
                (bird.y < p.top || bird.y + bird.h > p.bottom)) {
                gameOver();
            }

            // --- NY POÄNGRÄKNING ---
            // Om fågelns X-position är större än rörets X-position + dess bredd
            // OCH vi inte redan har räknat poäng för detta rör
            if (bird.x > p.x + 50 && !p.passed) {
                score++;
                p.passed = true; // Markera som avklarat!
                scoreElement.textContent = score;
            }
        });

        if (pipes.length > 0 && pipes[0].x < -50) pipes.shift();
        if (bird.y + bird.h > canvas.height || bird.y < 0) gameOver();

        frameCount++;
        requestAnimationFrame(draw);
    }

    function drawBird() {
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(bird.x, bird.y, bird.w, bird.h);
    }

    function gameOver() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("birdHighScore", highScore);
            highScoreElement.textContent = highScore;
        }
        bird.y = 200; bird.velocity = 0; pipes = []; score = 0;
        scoreElement.textContent = score; frameCount = 0;
        gameStarted = false;
    }

    function saveName() {
        let name = document.getElementById("playerName").value;
        if(name) alert("Namn sparat: " + name);
    }

    draw();