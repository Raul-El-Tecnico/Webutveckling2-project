    const canvas = document.getElementById("snakeCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");
    const highScoreElement = document.getElementById("highScore");
    const gameOverMsg = document.getElementById("gameOverMsg");

    // Hämta highscore från localStorage
    let highScore = localStorage.getItem("snakeHighScore") || 0;
    highScoreElement.textContent = highScore;

    // Spelvariabler
    let box = 20;
    let snake = [];
    let food = {};
    let d = "RIGHT";
    let score = 0;
    let gameRunning = false; // 🔥 FALSE = spelet är pausat/startar inte automatiskt
    let gameStarted = false; // 🔥 Har spelaren startat spelet?
    let gameInterval;

    // Initiera spelet
    function initGame() {
        snake = [{x: 10 * box, y: 10 * box}];
        food = { 
            x: Math.floor(Math.random() * 19 + 1) * box, 
            y: Math.floor(Math.random() * 19 + 1) * box 
        };
        d = "RIGHT";
        score = 0;
        scoreElement.textContent = score;
        gameRunning = false;
        gameStarted = false;
        gameOverMsg.style.display = "none";
        draw(); // Rita ut startskärmen direkt
    }

    // Skapa ny mat (utan att hamna på ormen)
    function generateFood() {
        let newFood;
        let valid = false;
        while (!valid) {
            newFood = {
                x: Math.floor(Math.random() * 19 + 1) * box,
                y: Math.floor(Math.random() * 19 + 1) * box
            };
            valid = true;
            for (let segment of snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    valid = false;
                    break;
                }
            }
        }
        food = newFood;
    }

    // 🔥 START-spelet (anropas vid första tangenttryck)
    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            gameRunning = true;
            gameOverMsg.style.display = "none";
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(draw, 120);
        }
    }

    // Tangentstyrning
    document.addEventListener("keydown", direction);
    function direction(event) {
        // 🔥 OM spelet inte har startats - starta det!
        if (!gameStarted) {
            startGame();
            // Sätt riktning baserat på tangenten som trycktes
            if (event.keyCode == 37) d = "LEFT";
            else if (event.keyCode == 38) d = "UP";
            else if (event.keyCode == 39) d = "RIGHT";
            else if (event.keyCode == 40) d = "DOWN";
            return;
        }

        // OM spelet är slut - starta om med mellanslag eller piltangent
        if (!gameRunning) {
            if (event.keyCode == 32 || (event.keyCode >= 37 && event.keyCode <= 40)) {
                restartGame();
                // Sätt riktning baserat på tangenten som trycktes
                if (event.keyCode == 37) d = "LEFT";
                else if (event.keyCode == 38) d = "UP";
                else if (event.keyCode == 39) d = "RIGHT";
                else if (event.keyCode == 40) d = "DOWN";
            }
            return;
        }

        // Normal styrning när spelet körs
        if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
        else if (event.keyCode == 38 && d != "DOWN") d = "UP";
        else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
        else if (event.keyCode == 40 && d != "UP") d = "DOWN";
    }

    // Kollision med sig själv
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) return true;
        }
        return false;
    }

    // Uppdatera highscore
    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreElement.textContent = highScore;
            return true;
        }
        return false;
    }

    // Starta om spelet snyggt
    function restartGame() {
        clearInterval(gameInterval);
        initGame();
        gameStarted = true; // 🔥 Spelet startar direkt vid omstart
        gameRunning = true;
        gameInterval = setInterval(draw, 120);
    }

    // 🎨 Rita spelet
    function draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 🔥 Om spelet inte har startats - visa startmeddelande
        if (!gameStarted) {
            // Rita ormen (stillastående)
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#2ecc71" : "#27ae60";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#1a7a3a";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
            // Rita maten
            ctx.fillStyle = "#e74c3c";
            ctx.beginPath();
            ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
            ctx.fill();

            // Visa startmeddelande
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, canvas.height/2 - 50, canvas.width, 100);
            
            ctx.fillStyle = "#f1c40f";
            ctx.font = "bold 24px 'Courier New', monospace";
            ctx.textAlign = "center";
            ctx.fillText("⬆️ ⬇️ ⬅️ ➡️", canvas.width/2, canvas.height/2 - 5);
            
            ctx.fillStyle = "white";
            ctx.font = "18px 'Courier New', monospace";
            ctx.fillText("Tryck på en piltangent för att starta", canvas.width/2, canvas.height/2 + 35);
            
            return; // Stanna här - inget mer uppdateras
        }

        // 🔥 Om spelet är slut - visa game over menyn
        if (!gameRunning) {
            // Rita ormen (orörlig)
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? "#555" : "#444";
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = "#333";
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
            // Rita maten (grå)
            ctx.fillStyle = "#666";
            ctx.beginPath();
            ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
            ctx.fill();

            // Visa game over-meddelande på canvas
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, canvas.height/2 - 60, canvas.width, 120);
            
            ctx.fillStyle = "#e74c3c";
            ctx.font = "bold 32px 'Courier New', monospace";
            ctx.textAlign = "center";
            ctx.fillText("💀 GAME OVER", canvas.width/2, canvas.height/2 - 5);
            
            ctx.fillStyle = "white";
            ctx.font = "16px 'Courier New', monospace";
            ctx.fillText("Tryck på MELLANSLAG eller en piltangent", canvas.width/2, canvas.height/2 + 40);
            
            return; // Stanna här
        }

        // 🎮 NORMAL SPELLOOP (när spelet körs)
        // Rita ormen
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "#2ecc71" : "#27ae60";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#1a7a3a";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        // Rita mat (äpple)
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(food.x + box/3, food.y + box/3, 3, 0, Math.PI * 2);
        ctx.fill();

        // Beräkna nästa position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        // Kolla om ormen äter mat
        if (snakeX == food.x && snakeY == food.y) {
            score++;
            scoreElement.textContent = score;
            generateFood();
        } else {
            snake.pop();
        }

        // Skapa nytt huvud
        let newHead = { x: snakeX, y: snakeY };

        // Kollision = GAME OVER
        if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
            gameRunning = false;
            gameOverMsg.style.display = "block";
            
            let newRecord = updateHighScore();
            if (newRecord) {
                gameOverMsg.innerHTML = "🎉 <strong>NYTT REKORD!</strong> " + score + " poäng! Tryck på MELLANSLAG eller piltangent för att spela igen";
                gameOverMsg.style.color = "#f1c40f";
            } else {
                gameOverMsg.innerHTML = "💀 Game Over! " + score + " poäng. Tryck på <strong>MELLANSLAG</strong> eller piltangent för att starta om";
                gameOverMsg.style.color = "#e74c3c";
            }
            
            // Rita om en sista gång för att visa game over på canvas
            draw();
            return;
        }

        snake.unshift(newHead);
    }

    // 🚀 Starta spelet (i pausat läge)
    initGame();