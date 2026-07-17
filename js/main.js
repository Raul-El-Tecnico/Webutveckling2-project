// ============================================
// MAIN.JS - Gemensamma funktioner för Retro Hub
// ============================================

// ---------- HIGHSCORE ----------
function getHighScore(game) {
    return localStorage.getItem(game + 'HighScore') || 0;
}

function setHighScore(game, score) {
    let high = getHighScore(game);
    if (score > high) {
        localStorage.setItem(game + 'HighScore', score);
        return true; // Nytt rekord!
    }
    return false;
}

// ---------- LJUD (för framtida bruk) ----------
function playSound(type) {
    // Här kan du senare lägga till ljudeffekter
    console.log('🎵 Spelar ljud:', type);
}

// ---------- SPARA NAMN ----------
function savePlayerName(game) {
    let name = document.getElementById('playerName')?.value;
    if (name) {
        localStorage.setItem(game + 'PlayerName', name);
        alert('✅ Namn sparat: ' + name);
        return true;
    } else {
        alert('⚠️ Vänligen skriv in ett namn!');
        return false;
    }
}

// ---------- HÄMTA NAMN ----------
function getPlayerName(game) {
    return localStorage.getItem(game + 'PlayerName') || 'Spelare';
}

// ---------- RUNDA HÖRN (polyfill för canvas) ----------
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        return this;
    };
}