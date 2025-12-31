let currentScene = 1;
const totalScenes = 8;
let poppedBalloons = 0;
const totalBalloons = 5;
let isPhotoDragging = false;
let startX = 0;
let currentX = 0;
let photoIndex = 0;
const photos = document.querySelectorAll('.photo-card');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupPhotoSwipe();
    setupGiftBox();
});

// Scene Navigation
function nextScene() {
    if (currentScene < totalScenes) {
        document.getElementById(`scene${currentScene}`).classList.remove('active');
        currentScene++;
        document.getElementById(`scene${currentScene}`).classList.add('active');
        
        // Special handling for scene 3 (balloons)
        if (currentScene === 3) {
            resetBalloons();
        }
        
        // Special handling for scene 4 (gift box)
        if (currentScene === 4) {
            setTimeout(() => {
                openGiftBox();
            }, 500);
        }
        
        // Special handling for scene 5 (photos)
        if (currentScene === 5) {
            resetPhotos();
        }
    }
}

// Balloon Popping Game
function popBalloon(element, message) {
    if (element.classList.contains('popped')) return;
    
    const balloon = element.querySelector('.balloon');
    balloon.classList.add('popped');
    element.classList.add('popped');
    poppedBalloons++;
    
    // Display message
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.textContent = message;
    messageDisplay.style.display = 'block';
    
    // Create confetti
    createConfetti(element);
    
    // Check if all balloons are popped
    if (poppedBalloons === totalBalloons) {
        setTimeout(() => {
            document.getElementById('next-after-balloons').classList.remove('hidden');
        }, 1000);
    }
}

function resetBalloons() {
    poppedBalloons = 0;
    const balloons = document.querySelectorAll('.balloon-wrapper');
    balloons.forEach(balloon => {
        balloon.classList.remove('popped');
        balloon.querySelector('.balloon').classList.remove('popped');
    });
    document.getElementById('message-display').textContent = '';
    document.getElementById('message-display').style.display = 'none';
    document.getElementById('next-after-balloons').classList.add('hidden');
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#ff1493', '#ff69b4', '#ff91c7', '#ffb3d9', '#ffd700', '#ff6b6b', '#87ceeb'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = (rect.left + rect.width / 2) + 'px';
        confetti.style.top = (rect.top + rect.height / 2) + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Gift Box
function setupGiftBox() {
    // Will be called when scene 4 loads
}

function openGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const characterPop = document.getElementById('characterPop');
    const confettiContainer = document.getElementById('confettiContainer');
    
    giftBox.classList.add('opened');
    
    setTimeout(() => {
        characterPop.classList.remove('hidden');
        characterPop.classList.add('show');
        
        // Create confetti explosion
        createGiftConfetti(confettiContainer);
    }, 300);
}

function createGiftConfetti(container) {
    const colors = ['#ff1493', '#ff69b4', '#ff91c7', '#ffb3d9', '#ffd700', '#ff6b6b', '#87ceeb', '#90ee90'];
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = centerX + 'px';
        confetti.style.top = centerY + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 100 + Math.random() * 100;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        confetti.style.setProperty('--x', x + 'px');
        confetti.style.setProperty('--y', y + 'px');
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 2000);
    }
}

// Photo Swipe
function setupPhotoSwipe() {
    photos.forEach((photo, index) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        photo.addEventListener('mousedown', (e) => {
            if (index !== photos.length - 1) return; // Only drag top photo
            isDragging = true;
            startX = e.clientX;
            photo.style.cursor = 'grabbing';
        });
        
        photo.addEventListener('mousemove', (e) => {
            if (!isDragging || index !== photos.length - 1) return;
            currentX = e.clientX - startX;
            photo.style.transform = `rotate(var(--rotation)) translateX(${currentX}px)`;
            
            if (Math.abs(currentX) > 100) {
                photo.style.opacity = 0.5;
            } else {
                photo.style.opacity = 1;
            }
        });
        
        photo.addEventListener('mouseup', () => {
            if (!isDragging || index !== photos.length - 1) return;
            isDragging = false;
            photo.style.cursor = 'grab';
            
            if (Math.abs(currentX) > 100) {
                swipePhoto();
            } else {
                photo.style.transform = `rotate(var(--rotation))`;
                photo.style.opacity = 1;
            }
            currentX = 0;
        });
        
        photo.addEventListener('mouseleave', () => {
            if (isDragging && index === photos.length - 1) {
                isDragging = false;
                photo.style.cursor = 'grab';
                if (Math.abs(currentX) > 100) {
                    swipePhoto();
                } else {
                    photo.style.transform = `rotate(var(--rotation))`;
                    photo.style.opacity = 1;
                }
                currentX = 0;
            }
        });
        
        // Touch events
        photo.addEventListener('touchstart', (e) => {
            if (index !== photos.length - 1) return;
            isDragging = true;
            startX = e.touches[0].clientX;
        });
        
        photo.addEventListener('touchmove', (e) => {
            if (!isDragging || index !== photos.length - 1) return;
            currentX = e.touches[0].clientX - startX;
            photo.style.transform = `rotate(var(--rotation)) translateX(${currentX}px)`;
            
            if (Math.abs(currentX) > 100) {
                photo.style.opacity = 0.5;
            } else {
                photo.style.opacity = 1;
            }
        });
        
        photo.addEventListener('touchend', () => {
            if (!isDragging || index !== photos.length - 1) return;
            isDragging = false;
            
            if (Math.abs(currentX) > 100) {
                swipePhoto();
            } else {
                photo.style.transform = `rotate(var(--rotation))`;
                photo.style.opacity = 1;
            }
            currentX = 0;
        });
    });
}

function swipePhoto() {
    if (photoIndex >= photos.length - 1) return;
    
    const currentPhoto = photos[photoIndex];
    currentPhoto.style.transform = `rotate(var(--rotation)) translateX(${currentX > 0 ? 500 : -500}px)`;
    currentPhoto.style.opacity = 0;
    currentPhoto.style.transition = 'all 0.5s ease-out';
    currentPhoto.style.zIndex = 1;
    
    setTimeout(() => {
        currentPhoto.style.display = 'none';
        photoIndex++;
        
        if (photoIndex < photos.length) {
            photos[photoIndex].style.zIndex = photos.length;
        }
    }, 500);
}

function resetPhotos() {
    photoIndex = 0;
    photos.forEach((photo, index) => {
        photo.style.display = 'block';
        photo.style.transform = `rotate(var(--rotation))`;
        photo.style.opacity = 1;
        photo.style.transition = 'none';
        photo.style.zIndex = photos.length - index;
    });
}
