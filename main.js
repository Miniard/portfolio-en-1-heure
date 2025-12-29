/**
 * Main JavaScript - Portfolio Interactions
 * Gère les animations, la navigation et les effets globaux
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cursor glow effect
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation fluide du glow
    function animateGlow() {
        const speed = 0.1;
        glowX += (mouseX - glowX) * speed;
        glowY += (mouseY - glowY) * speed;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
    
    // Hide glow when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '0.5';
    });
    
    // Navigation active state
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Smooth scroll with offset for fixed nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger skill bar animation
                if (entry.target.classList.contains('skill-card')) {
                    const progress = entry.target.querySelector('.skill-progress');
                    if (progress) {
                        progress.style.animation = 'none';
                        progress.offsetHeight; // Trigger reflow
                        progress.style.animation = 'fillProgress 1.5s ease forwards';
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.skill-card, .section-header').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    // Add scroll animation styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-card:nth-child(1) { transition-delay: 0s; }
        .skill-card:nth-child(2) { transition-delay: 0.1s; }
        .skill-card:nth-child(3) { transition-delay: 0.2s; }
        .skill-card:nth-child(4) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Typing effect for hero
    const codeContent = document.querySelector('.code-content code');
    if (codeContent) {
        const originalHTML = codeContent.innerHTML;
        
        // Add blinking cursor to code
        const cursor = document.createElement('span');
        cursor.className = 'code-cursor';
        cursor.innerHTML = '|';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            color: #00ff88;
        `;
        codeContent.appendChild(cursor);
    }
    
    // Konami Code Easter Egg
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        // Change theme temporarily
        document.body.style.transition = 'all 0.5s';
        document.body.style.filter = 'hue-rotate(180deg)';
        
        // Show message
        const message = document.createElement('div');
        message.innerHTML = '🎮 KONAMI CODE ACTIVATED! 🎮';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #00ff88, #00ccff);
            color: #0a0a0f;
            padding: 2rem 4rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.5rem;
            font-weight: 700;
            border-radius: 16px;
            z-index: 10000;
            animation: popIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        
        // Add confetti effect
        createConfetti();
        
        setTimeout(() => {
            document.body.style.filter = 'none';
            message.remove();
        }, 3000);
    }
    
    function createConfetti() {
        const colors = ['#00ff88', '#00ccff', '#ff0066', '#ffcc00', '#bd93f9'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -20px;
                opacity: ${Math.random()};
                transform: rotate(${Math.random() * 360}deg);
                z-index: 9999;
                pointer-events: none;
                animation: fall ${2 + Math.random() * 3}s linear forwards;
            `;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }
    
    // Add confetti animation
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(720deg);
            }
        }
        
        @keyframes popIn {
            0% {
                transform: translate(-50%, -50%) scale(0);
            }
            50% {
                transform: translate(-50%, -50%) scale(1.1);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(confettiStyle);
    
    // Focus terminal on click
    document.querySelector('.terminal')?.addEventListener('click', () => {
        document.getElementById('terminal-input')?.focus();
    });
    
    // Console Easter Egg for devs
    console.log(`
    %c╔════════════════════════════════════════╗
    ║                                        ║
    ║  👋 Hey toi, dev curieux !             ║
    ║                                        ║
    ║  Tu fouilles dans la console ?         ║
    ║  J'aime ça ! 😎                        ║
    ║                                        ║
    ║  Essaie le Konami Code sur le site     ║
    ║  pour une surprise...                  ║
    ║                                        ║
    ║  ↑ ↑ ↓ ↓ ← → ← → B A                   ║
    ║                                        ║
    ╚════════════════════════════════════════╝
    `, 'color: #00ff88; font-family: monospace; font-size: 12px;');
});

