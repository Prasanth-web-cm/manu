// script.js

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// --- 0. Login Logic ---
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');

// THE SECRET PASSWORD (default is "manu", you can change it here)
const SECRET_PASSWORD = "manu"; 

function attemptLogin() {
    if (passwordInput.value.toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
        // Success! Fade out login screen and start experience
        gsap.to(loginScreen, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                loginScreen.style.display = 'none';
                startExperience();
            }
        });
    } else {
        // Fail! Show error and shake
        loginError.style.opacity = '1';
        gsap.fromTo(passwordInput, { x: -10 }, { x: 10, duration: 0.1, yoyo: true, repeat: 5 });
        setTimeout(() => { loginError.style.opacity = '0'; }, 3000);
    }
}

loginBtn.addEventListener('click', attemptLogin);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') attemptLogin();
});

// --- 1. Loading Screen Sequence ---
function startExperience() {
    const tl = gsap.timeline();

    // Fade in loader quote
    tl.to('#loader-text', { opacity: 1, duration: 1, delay: 0.5 })
      // Hold it
      .to({}, { duration: 1.5 })
      // Fade out quote and loader
      .to('#loader-text', { opacity: 0, duration: 0.8 })
      .to('#loader', { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, "-=0.2")
      // Reveal Main Content
      .set('#main-content', { display: 'block' })
      .to('#main-content', { opacity: 1, duration: 1 }, "-=0.5")
      // Trigger Hero Animations
      .call(initHeroAnimations);
}


// --- 2. Hero Animations & Typewriter ---
function initHeroAnimations() {
    gsap.from('#hero h1 span', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });

    // Typewriter effect
    const heroText = "Every photo tells a story. Every memory tells a journey. And every journey is better with a friend like you.";
    const typewriterElement = document.getElementById('hero-typewriter');
    
    let i = 0;
    function typeWriter() {
        if (i < heroText.length) {
            typewriterElement.innerHTML += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 50); // Speed of typing
        }
    }
    
    // Start typing slightly after heading animates in
    setTimeout(typeWriter, 1000);
}

// --- 3. Mouse Follower Glow ---
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    // We use CSS transition for a slight lag, so we just set top/left
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// --- 4. Scroll Progress Bar ---
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// --- 5. Audio Toggle ---
const audioToggleBtn = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
const audioIcon = audioToggleBtn.querySelector('i');
let isPlaying = false;

// Set volume lower so it's not overpowering
bgMusic.volume = 0.3;

audioToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        audioIcon.classList.remove('fa-volume-high');
        audioIcon.classList.add('fa-music');
        audioToggleBtn.classList.remove('bg-white/30');
    } else {
        // Try playing
        bgMusic.play().catch(error => console.log("Audio play failed:", error));
        audioIcon.classList.remove('fa-music');
        audioIcon.classList.add('fa-volume-high');
        audioToggleBtn.classList.add('bg-white/30');
    }
    isPlaying = !isPlaying;
});

// --- 6. GSAP Scroll Animations ---

// Timeline Items Reveal
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 80%", // trigger when top of item hits 80% of viewport
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
});

// Gallery Masonry Reveal
gsap.utils.toArray('.gallery-img').forEach((img, i) => {
    gsap.from(img, {
        scrollTrigger: {
            trigger: img,
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.2)"
    });
});

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
let hasCounted = false;

ScrollTrigger.create({
    trigger: "#stats",
    start: "top 80%",
    onEnter: () => {
        if (!hasCounted) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                
                // Using GSAP to animate a proxy object and update text
                let proxy = { val: 0 };
                gsap.to(proxy, {
                    val: target,
                    duration: 2.5,
                    ease: "power2.out",
                    onUpdate: function() {
                        counter.innerText = Math.floor(this.targets()[0].val);
                    }
                });
            });
            hasCounted = true;
        }
    }
});

// Letter Reveal
const letterTexts = document.querySelectorAll('.letter-text');
gsap.from(letterTexts, {
    scrollTrigger: {
        trigger: "#letter",
        start: "top 70%",
    },
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// --- 7. Grand Finale & Confetti ---
let confettiFired = false;

ScrollTrigger.create({
    trigger: "#finale",
    start: "top 50%",
    onEnter: () => {
        if (!confettiFired) {
            fireConfetti();
            confettiFired = true;
            
            // Finale Text Animation
            gsap.from('.finale-text p', {
                y: 20,
                opacity: 0,
                duration: 1,
                stagger: 0.3,
                ease: "power2.out",
                delay: 0.5
            });
        }
    }
});

function fireConfetti() {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
        // launch a few confetti from the left edge
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#06B6D4', '#8B5CF6', '#EC4899']
        });
        // and launch a few from the right edge
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#06B6D4', '#8B5CF6', '#EC4899']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Back to Top Button
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // Reset confetti so it can fire again
});

// --- 8. Cinematic Montage (Video Replacement) ---
const playOverlay = document.getElementById('play-overlay');
const montageBtn = document.getElementById('montage-play-btn');
const montageContainer = document.getElementById('montage-container');
const montageImgs = document.querySelectorAll('.montage-img');
let montageInterval;

if (montageBtn) {
    montageBtn.addEventListener('click', () => {
        // Hide overlay
        playOverlay.style.opacity = '0';
        playOverlay.style.pointerEvents = 'none';
        montageContainer.style.opacity = '1';
        
        // Play music if not playing
        if (!isPlaying) {
            audioToggleBtn.click();
        }

        let currentIndex = 0;
        
        // Initial zoom for first image
        montageImgs[currentIndex].style.transform = 'scale(1.1)';

        montageInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % montageImgs.length;
            
            // Reset next image to scale 1 before showing
            montageImgs[nextIndex].style.transition = 'none';
            montageImgs[nextIndex].style.transform = 'scale(1)';
            montageImgs[nextIndex].style.opacity = '0';
            
            // Force reflow
            void montageImgs[nextIndex].offsetWidth;
            
            // Fade in and zoom next image
            montageImgs[nextIndex].style.transition = 'opacity 2s ease-in-out, transform 4s ease-out';
            montageImgs[nextIndex].style.opacity = '1';
            montageImgs[nextIndex].style.transform = 'scale(1.1)';
            
            // Fade out previous image slowly
            montageImgs[currentIndex].style.opacity = '0';
            
            currentIndex = nextIndex;
        }, 3000);
    });
}

