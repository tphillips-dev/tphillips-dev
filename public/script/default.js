// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Add subtle animation to cards on scroll
const cards = document.querySelectorAll('.card');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

cards.forEach(card => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

const profilePic = document.querySelector('.profile-pic');
let isHoverEnabled = false;

function checkHover() {
    if (window.matchMedia('(hover: hover)').matches) {
        isHoverEnabled = true;
    }
}

checkHover();
window.addEventListener('resize', checkHover);

profilePic.addEventListener('touchstart', function() {
    if (!isHoverEnabled) {
        this.style.transform = 'rotate(-2deg) scale(1.03)';
    }
});

profilePic.addEventListener('touchend', function() {
    if (!isHoverEnabled) {
        this.style.transform = 'none';
    }
});