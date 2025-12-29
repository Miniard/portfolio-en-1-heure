/**
 * Catch The Bugs - Mini Game
 * Un jeu de réflexes addictif pour impressionner les visiteurs
 */

class BugCatcher {
    constructor() {
        this.gameArea = document.getElementById('game-area');
        this.overlay = document.getElementById('game-overlay');
        this.startBtn = document.getElementById('start-game');
        this.resetBtn = document.getElementById('reset-game');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.highScoreDisplay = document.getElementById('high-score');
        
        this.score = 0;
        this.timeLeft = 30;
        this.highScore = parseInt(localStorage.getItem('bugCatcherHighScore')) || 0;
        this.isRunning = false;
        this.gameLoop = null;
        this.spawnLoop = null;
        this.bugs = [];
        
        // Types de bugs avec différentes propriétés
        this.bugTypes = [
            { emoji: '🐛', points: 10, speed: 'normal', chance: 0.4 },
            { emoji: '🐜', points: 15, speed: 'fast', chance: 0.25 },
            { emoji: '🦗', points: 20, speed: 'fast', chance: 0.15 },
            { emoji: '🕷️', points: 25, speed: 'slow', chance: 0.1 },
            { emoji: '🦟', points: 30, speed: 'veryfast', chance: 0.07 },
            { emoji: '💎', points: 50, speed: 'normal', chance: 0.03 } // Bonus rare !
        ];
        
        this.init();
    }
    
    init() {
        this.highScoreDisplay.textContent = this.highScore;
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Empêcher la sélection de texte pendant le jeu
        this.gameArea.addEventListener('selectstart', (e) => e.preventDefault());
    }
    
    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.isRunning = true;
        this.bugs = [];
        
        this.updateDisplay();
        this.overlay.classList.add('hidden');
        
        // Boucle principale du timer
        this.gameLoop = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            
            // Accélérer le spawn quand le temps diminue
            if (this.timeLeft === 20) {
                this.adjustSpawnRate(600);
            } else if (this.timeLeft === 10) {
                this.adjustSpawnRate(400);
            }
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Spawn des bugs
        this.adjustSpawnRate(800);
    }
    
    adjustSpawnRate(interval) {
        if (this.spawnLoop) {
            clearInterval(this.spawnLoop);
        }
        this.spawnLoop = setInterval(() => {
            if (this.isRunning) {
                this.spawnBug();
            }
        }, interval);
    }
    
    spawnBug() {
        const bugType = this.selectBugType();
        const bug = this.createBugElement(bugType);
        
        // Position aléatoire dans la zone de jeu
        const areaRect = this.gameArea.getBoundingClientRect();
        const maxX = areaRect.width - 50;
        const maxY = areaRect.height - 50;
        
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        
        bug.style.left = `${x}px`;
        bug.style.top = `${y}px`;
        
        // Durée de vie du bug
        const lifespan = this.getLifespan(bugType.speed);
        
        const bugData = {
            element: bug,
            type: bugType,
            timeout: setTimeout(() => this.removeBug(bugData), lifespan)
        };
        
        this.bugs.push(bugData);
        this.gameArea.appendChild(bug);
        
        // Animation d'apparition
        requestAnimationFrame(() => {
            bug.style.transform = 'scale(1)';
            bug.style.opacity = '1';
        });
        
        // Mouvement aléatoire pour certains bugs
        if (bugType.speed === 'fast' || bugType.speed === 'veryfast') {
            this.animateBug(bugData);
        }
    }
    
    createBugElement(bugType) {
        const bug = document.createElement('div');
        bug.className = 'bug';
        bug.textContent = bugType.emoji;
        bug.style.transform = 'scale(0)';
        bug.style.opacity = '0';
        bug.style.transition = 'transform 0.2s, opacity 0.2s';
        
        // Taille variable
        const size = bugType.points > 30 ? 2.5 : 2;
        bug.style.fontSize = `${size}rem`;
        
        bug.addEventListener('click', (e) => {
            e.stopPropagation();
            this.catchBug(bugType, bug);
        });
        
        return bug;
    }
    
    selectBugType() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const type of this.bugTypes) {
            cumulative += type.chance;
            if (rand <= cumulative) {
                return type;
            }
        }
        
        return this.bugTypes[0]; // Fallback
    }
    
    getLifespan(speed) {
        const lifespans = {
            slow: 4000,
            normal: 2500,
            fast: 1800,
            veryfast: 1200
        };
        return lifespans[speed] || 2500;
    }
    
    animateBug(bugData) {
        if (!this.isRunning || !bugData.element.parentNode) return;
        
        const areaRect = this.gameArea.getBoundingClientRect();
        const maxX = areaRect.width - 50;
        const maxY = areaRect.height - 50;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        bugData.element.style.transition = 'left 0.5s, top 0.5s, transform 0.2s, opacity 0.2s';
        bugData.element.style.left = `${newX}px`;
        bugData.element.style.top = `${newY}px`;
        
        // Continue l'animation
        const speed = bugData.type.speed === 'veryfast' ? 300 : 500;
        setTimeout(() => this.animateBug(bugData), speed);
    }
    
    catchBug(bugType, bugElement) {
        if (!this.isRunning) return;
        
        // Animation de capture
        bugElement.classList.add('caught');
        
        // Afficher les points gagnés
        this.showPoints(bugElement, bugType.points);
        
        // Son de feedback (optionnel - via CSS animation)
        this.score += bugType.points;
        this.updateDisplay();
        
        // Retirer le bug après l'animation
        setTimeout(() => {
            if (bugElement.parentNode) {
                bugElement.parentNode.removeChild(bugElement);
            }
        }, 300);
        
        // Retirer de la liste des bugs actifs
        const index = this.bugs.findIndex(b => b.element === bugElement);
        if (index > -1) {
            clearTimeout(this.bugs[index].timeout);
            this.bugs.splice(index, 1);
        }
    }
    
    showPoints(bugElement, points) {
        const pointsEl = document.createElement('div');
        pointsEl.className = 'points-popup';
        pointsEl.textContent = `+${points}`;
        pointsEl.style.cssText = `
            position: absolute;
            left: ${bugElement.style.left};
            top: ${bugElement.style.top};
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.2rem;
            font-weight: 700;
            color: #00ff88;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
            pointer-events: none;
            animation: floatUp 0.8s forwards;
            z-index: 20;
        `;
        
        this.gameArea.appendChild(pointsEl);
        
        setTimeout(() => {
            if (pointsEl.parentNode) {
                pointsEl.parentNode.removeChild(pointsEl);
            }
        }, 800);
    }
    
    removeBug(bugData) {
        if (bugData.element.parentNode) {
            bugData.element.style.opacity = '0';
            bugData.element.style.transform = 'scale(0)';
            
            setTimeout(() => {
                if (bugData.element.parentNode) {
                    bugData.element.parentNode.removeChild(bugData.element);
                }
            }, 200);
        }
        
        const index = this.bugs.indexOf(bugData);
        if (index > -1) {
            this.bugs.splice(index, 1);
        }
    }
    
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.timerDisplay.textContent = this.timeLeft;
    }
    
    endGame() {
        this.isRunning = false;
        
        clearInterval(this.gameLoop);
        clearInterval(this.spawnLoop);
        
        // Nettoyer tous les bugs
        this.bugs.forEach(bug => {
            clearTimeout(bug.timeout);
            if (bug.element.parentNode) {
                bug.element.parentNode.removeChild(bug.element);
            }
        });
        this.bugs = [];
        
        // Vérifier le high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('bugCatcherHighScore', this.highScore);
            this.highScoreDisplay.textContent = this.highScore;
        }
        
        // Afficher l'écran de fin
        this.showEndScreen();
    }
    
    showEndScreen() {
        const isNewHighScore = this.score === this.highScore && this.score > 0;
        
        this.overlay.innerHTML = `
            <div class="game-start-content">
                <div class="game-icon">${isNewHighScore ? '🏆' : '🎮'}</div>
                <h3>${isNewHighScore ? 'Nouveau Record !' : 'Game Over !'}</h3>
                <p class="final-score">Score: <strong>${this.score}</strong> points</p>
                ${isNewHighScore ? '<p class="new-record">Tu as battu ton record ! 🎉</p>' : ''}
                <button class="btn btn-primary" id="restart-game">
                    <span>Rejouer</span>
                </button>
            </div>
        `;
        
        this.overlay.classList.remove('hidden');
        
        document.getElementById('restart-game').addEventListener('click', () => {
            this.resetOverlay();
            this.startGame();
        });
    }
    
    resetOverlay() {
        this.overlay.innerHTML = `
            <div class="game-start-content">
                <div class="game-icon">🐛</div>
                <h3>Prêt à chasser les bugs ?</h3>
                <p>Clique sur les bugs le plus vite possible !</p>
                <button class="btn btn-primary" id="start-game">
                    <span>Commencer</span>
                </button>
            </div>
        `;
        
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
    }
    
    resetGame() {
        this.isRunning = false;
        
        clearInterval(this.gameLoop);
        clearInterval(this.spawnLoop);
        
        // Nettoyer tous les bugs
        this.bugs.forEach(bug => {
            clearTimeout(bug.timeout);
            if (bug.element.parentNode) {
                bug.element.parentNode.removeChild(bug.element);
            }
        });
        this.bugs = [];
        
        this.score = 0;
        this.timeLeft = 30;
        this.updateDisplay();
        
        this.resetOverlay();
        this.overlay.classList.remove('hidden');
    }
}

// Ajouter l'animation CSS pour les points
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    .final-score {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .final-score strong {
        color: #00ff88;
        font-size: 2rem;
    }
    
    .new-record {
        color: #ffcc00;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bugCatcher = new BugCatcher();
});

