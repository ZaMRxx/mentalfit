// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
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

// Observe all cards and features
document.querySelectorAll('.pillar-card, .feature-item, .about-mission, .about-vision, .about-innovation, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Add subtle parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-illustration');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Console welcome message
console.log('%c💪 MentalFit - Gym for Mind & Body', 
    'color: #c0c0c0; font-size: 20px; font-weight: bold;');
console.log('%cSelamat datang! 🧠', 
    'color: #a0a0a0; font-size: 14px;');

// Initialize localStorage if not exists
if (!localStorage.getItem('mentalfit_user')) {
    const defaultUser = {
        streak: 0,
        totalWorkouts: 0,
        totalMeditations: 0,
        journalEntries: [],
        lastVisit: new Date().toISOString()
    };
    localStorage.setItem('mentalfit_user', JSON.stringify(defaultUser));
}