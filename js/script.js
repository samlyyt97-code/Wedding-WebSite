/* ============================================
   WEDDING WEBSITE - COMPLETE JAVASCRIPT
   Muslim Nikkah Theme
   ============================================ */

// ============ CONFIGURATION ============
const CONFIG = {
    // ⚡ CHANGE THESE VALUES ⚡
    weddingDate: new Date('2026-04-18T11:59:59'),  // Change to your wedding date & time
    groomName: 'Samly',                         // Change to groom's name
    brideName: 'Asma',                         // Change to bride's name
    password: 'nikah2025',                           // Change to your desired password
    
    // Session key for authentication
    sessionKey: 'wedding_access_granted',
    sessionValue: 'bismillah_blessed'
};

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we're on
    const isCountdownPage = document.body.classList.contains('countdown-page');
    const isGalleryPage = document.body.classList.contains('gallery-page');

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    if (isCountdownPage) {
        initCountdownPage();
    }

    if (isGalleryPage) {
        initGalleryPage();
    }
});

// ============================================
// COUNTDOWN PAGE
// ============================================
function initCountdownPage() {
    createParticles();
    startCountdown();
    initHandsAnimation();
    initPasswordProtection();
}

// ============ PARTICLE EFFECTS ============
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 20 : 40;
    const colors = ['rgba(212,165,116,0.4)', 'rgba(232,160,191,0.3)', 'rgba(255,255,255,0.2)'];
    const shapes = ['circle', 'star'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * duration;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
        `;

        // Randomly make some particles star-shaped
        if (Math.random() > 0.7) {
            particle.style.borderRadius = '0';
            particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            particle.style.width = `${size * 2}px`;
            particle.style.height = `${size * 2}px`;
        }

        container.appendChild(particle);
    }
}

// ============ COUNTDOWN TIMER ============
function startCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const enterSection = document.getElementById('enterSection');

    if (!daysEl) return;

    function updateCountdown() {
        const now = new Date();
        const diff = CONFIG.weddingDate - now;

        if (diff <= 0) {
            // Wedding day or past!
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            // Show enter button
            if (enterSection) {
                enterSection.style.display = 'block';
                enterSection.classList.add('fade-in');
            }

            // Set hands to connected state
            setHandsConnected();

            return; // Stop the interval
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Animate number changes
        animateNumber(daysEl, days.toString().padStart(3, '0'));
        animateNumber(hoursEl, hours.toString().padStart(2, '0'));
        animateNumber(minutesEl, minutes.toString().padStart(2, '0'));
        animateNumber(secondsEl, seconds.toString().padStart(2, '0'));

        // Update hands animation based on remaining time
        updateHandsPosition(diff);
    }

    // Initial call
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}

function animateNumber(element, newValue) {
    if (element.textContent !== newValue) {
        element.style.transform = 'scale(1.1)';
        element.textContent = newValue;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// ============ HANDS ANIMATION ============
function initHandsAnimation() {
    const leftHand = document.getElementById('leftHand');
    const rightHand = document.getElementById('rightHand');

    if (!leftHand || !rightHand) return;

    // Add subtle idle animation
    addIdleAnimation(leftHand, 'left');
    addIdleAnimation(rightHand, 'right');
}

function addIdleAnimation(element, side) {
    let angle = 0;
    const speed = 0.02;
    const amplitude = 3;

    function animate() {
        angle += speed;
        const offset = Math.sin(angle) * amplitude;
        
        if (side === 'left') {
            element.style.transform = `translateX(${element._baseX || 0}px) translateY(${offset}px)`;
        } else {
            element.style.transform = `translateX(${element._baseX || 0}px) translateY(${-offset}px)`;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function updateHandsPosition(timeDiff) {
    const leftHand = document.getElementById('leftHand');
    const rightHand = document.getElementById('rightHand');
    const distanceFill = document.getElementById('distanceFill');
    const distanceText = document.getElementById('distanceText');

    if (!leftHand || !rightHand) return;

    // Calculate total time (from now to wedding)
    // We'll use a reference start date for the animation range
    const totalDuration = 365 * 24 * 60 * 60 * 1000; // 1 year in ms (adjust as needed)
    
    // Calculate progress (0 = far apart, 1 = touching)
    let progress = 1 - Math.min(timeDiff / totalDuration, 1);
    progress = Math.max(0, Math.min(1, progress));

    // Move hands closer based on progress
    const maxDistance = window.innerWidth < 768 ? 30 : 60; // max pixels to move
    const moveDistance = progress * maxDistance;

    leftHand._baseX = moveDistance;
    rightHand._baseX = -moveDistance;

    // Update distance bar
    if (distanceFill) {
        distanceFill.style.width = `${progress * 100}%`;
    }

    // Update distance text
    if (distanceText) {
        if (progress < 0.25) {
            distanceText.textContent = '🤲 Hands far apart... but getting closer each day';
        } else if (progress < 0.5) {
            distanceText.textContent = '💫 The distance is shrinking... SubhanAllah';
        } else if (progress < 0.75) {
            distanceText.textContent = '✨ Almost there... can feel the warmth';
        } else if (progress < 0.95) {
            distanceText.textContent = '💕 So close now... just a little more patience';
        } else {
            distanceText.textContent = '❤️ Almost touching... the moment is near!';
        }
    }

    // Show glow effect when close
    const leftGlow = document.querySelector('.left-glow');
    const rightGlow = document.querySelector('.right-glow');
    if (leftGlow && rightGlow) {
        const glowOpacity = Math.max(0, (progress - 0.5) * 1);
        leftGlow.style.opacity = glowOpacity;
        rightGlow.style.opacity = glowOpacity;
    }

    // Show connection ring when very close
    const connectionRing = document.getElementById('connectionRing');
    if (connectionRing) {
        connectionRing.style.opacity = progress > 0.8 ? (progress - 0.8) * 5 : 0;
    }
}

function setHandsConnected() {
    const handsWrapper = document.querySelector('.hands-wrapper');
    const distanceFill = document.getElementById('distanceFill');
    const distanceText = document.getElementById('distanceText');
    const heartBurst = document.getElementById('heartBurst');

    if (handsWrapper) {
        handsWrapper.parentElement.classList.add('hands-connected');
    }

    if (distanceFill) {
        distanceFill.style.width = '100%';
    }

    if (distanceText) {
        distanceText.textContent = '❤️ Alhamdulillah! Two hands, one heart, united by Allah!';
        distanceText.style.color = 'var(--gold)';
        distanceText.style.opacity = '1';
        distanceText.style.fontWeight = '500';
    }

    // Create sparks
    createSparks();
}

function createSparks() {
    const container = document.getElementById('sparkContainer');
    if (!container) return;

    for (let i = 0; i < 12; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--gold);
            border-radius: 50%;
            animation: sparkAnim ${0.5 + Math.random() * 0.5}s ease-out forwards;
            animation-delay: ${Math.random() * 0.3}s;
        `;
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        
        spark.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        spark.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        container.appendChild(spark);
    }

    // Add spark animation to head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkAnim {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ============ PASSWORD PROTECTION ============
function initPasswordProtection() {
    const unlockBtn = document.getElementById('unlockBtn');
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');

    if (!unlockBtn) return;

    unlockBtn.addEventListener('click', handlePasswordSubmit);
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handlePasswordSubmit();
            }
        });

        // Clear error on input
        passwordInput.addEventListener('input', () => {
            if (passwordError) {
                passwordError.style.display = 'none';
            }
        });
    }
}

function handlePasswordSubmit() {
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');

    if (!passwordInput) return;

    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === CONFIG.password) {
        // Password correct!
        // Store session
        sessionStorage.setItem(CONFIG.sessionKey, CONFIG.sessionValue);
        
        // Add success animation
        const unlockBtn = document.getElementById('unlockBtn');
        if (unlockBtn) {
            unlockBtn.innerHTML = '<i class="fas fa-check"></i> <span>Unlocked!</span>';
            unlockBtn.style.background = '#27ae60';
        }

        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'gallery.html';
        }, 800);

    } else {
        // Wrong password
        if (passwordError) {
            passwordError.style.display = 'block';
            passwordError.style.animation = 'none';
            // Trigger reflow
            passwordError.offsetHeight;
            passwordError.style.animation = 'shake 0.5s ease';
        }
        
        passwordInput.value = '';
        passwordInput.focus();
        
        // Add shake to input
        passwordInput.style.animation = 'none';
        passwordInput.offsetHeight;
        passwordInput.style.animation = 'shake 0.5s ease';
        passwordInput.style.borderColor = '#e74c3c';
        
        setTimeout(() => {
            passwordInput.style.borderColor = '';
        }, 1000);
    }
}

// ============================================
// GALLERY PAGE
// ============================================
function initGalleryPage() {
    checkAccess();
    initNavigation();
    initLightbox();
    initScrollEffects();
}

// ============ ACCESS CHECK ============
function checkAccess() {
    const overlay = document.getElementById('accessOverlay');
    
    // Check if user has valid session
    const hasAccess = sessionStorage.getItem(CONFIG.sessionKey) === CONFIG.sessionValue;

    if (!hasAccess) {
        // No access - redirect to countdown page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Has access - remove overlay
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 800);
    }
}

// ============ NAVIGATION ============
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const nav = document.querySelector('.gallery-nav');

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Close menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Nav scroll effect
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for nav links
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============ LIGHTBOX ============
function initLightbox() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightboxModal) return;

    // Click on any memory image or gallery image
    const clickableImages = document.querySelectorAll(
        '.memory-image-container img, .gallery-item img, .polaroid img, .umrah-image'
    );

    clickableImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            if (lightboxImage) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
            }
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============ SCROLL EFFECTS ============
function initScrollEffects() {
    // Parallax effect for hero
    const hero = document.querySelector('.gallery-hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
}

// ============ UTILITY FUNCTIONS ============

// Format date nicely
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Update wedding date display
(function updateWeddingDateDisplay() {
    const dateText = document.getElementById('weddingDateText');
    if (dateText) {
        dateText.textContent = formatDate(CONFIG.weddingDate);
    }
})();

// ============ EASTER EGGS ============

// Konami Code Easter Egg (fun for developers!)
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        document.body.style.transition = 'filter 1s ease';
        document.body.style.filter = 'hue-rotate(180deg)';
        
        setTimeout(() => {
            document.body.style.filter = '';
            alert('🎉 MashaAllah! You found the developer easter egg! May Allah bless this union! 🤲');
        }, 2000);
    }
});

// Console message for fellow developers
console.log('%c💍 This website was crafted with love for a beautiful Nikkah 💍', 
    'color: #d4a574; font-size: 16px; font-weight: bold;');
console.log('%c🤲 May Allah bless all marriages with love, mercy and Barakah. Ameen! 🤲', 
    'color: #e8a0bf; font-size: 14px;');
console.log('%c👨‍💻 Built by a Software Engineer for his Doctor bride-to-be 💉', 
    'color: #0f3460; font-size: 12px;');
