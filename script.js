// Get DOM elements
const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.min-hand');
const secondHand = document.querySelector('.second-hand');
const digitalTime = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const dayElement = document.querySelector('.day');
const centerDot = document.querySelector('.center-dot');
const analogClock = document.querySelector('.analog-clock');
const cracks = document.querySelectorAll('.crack');

// Fix number rotation
document.querySelectorAll('.number').forEach(number => {
    const numberClass = number.className;
    const rotationDeg = numberClass.includes('number-') ? 
        parseInt(numberClass.split('number-')[1]) * 30 : 0;
    number.style.transform = `rotate(${rotationDeg}deg)`;
    number.innerHTML = `<span style="transform: rotate(-${rotationDeg}deg)">${number.textContent}</span>`;
});

// Handle center dot click
let isRevealed = false;

function toggleCrackEffect() {
    if (!isRevealed) {
        analogClock.classList.add('cracked');
        
        // Animate cracks with different delays
        cracks.forEach((crack, index) => {
            crack.style.setProperty('--rotation', `${(index * 30 - 45)}deg`);
            setTimeout(() => {
                crack.style.animation = 'none';
                crack.offsetHeight; // Trigger reflow
                crack.style.animation = null;
            }, index * 100);
        });

        isRevealed = true;
    } else {
        analogClock.classList.remove('cracked');
        isRevealed = false;
    }
}

// Add both click and touch events for better mobile support
centerDot.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCrackEffect();
});

centerDot.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCrackEffect();
});

// Update clock function
function updateClock() {
    const now = new Date();
    
    // Update digital clock
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = now.getMilliseconds();
    
    digitalTime.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date and day
    const dateOptions = { month: 'long', day: 'numeric' };
    const dayOptions = { weekday: 'long' };
    
    if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    if (dayElement) dayElement.textContent = now.toLocaleDateString('en-US', dayOptions);
    
    // Calculate angles for analog clock hands
    const secondsDegrees = ((now.getSeconds() * 1000 + milliseconds) / 60000 * 360) + 90;
    const minutesDegrees = ((now.getMinutes() * 60000 + now.getSeconds() * 1000 + milliseconds) / 3600000 * 360) + 90;
    const hoursDegrees = ((now.getHours() % 12) * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + milliseconds) / 43200000 * 360 + 90;
    
    // Apply rotations
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
}

// Initial call
updateClock();

// Update every 16ms (approximately 60fps)
setInterval(updateClock, 16); 