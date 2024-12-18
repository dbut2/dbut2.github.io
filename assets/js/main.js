document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    const images = document.querySelectorAll('a.lightbox');
    images.forEach(image => {
        image.addEventListener('click', e => {
            e.preventDefault();
            lightbox.classList.add('active');
            const img = document.createElement('img');
            img.src = image.href;
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }
            lightbox.appendChild(img);
        });
    });

    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
});

// Add some basic styles for the lightbox
const style = document.createElement('style');
style.textContent = `
    #lightbox {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
    }
    #lightbox.active {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #lightbox img {
        max-width: 90%;
        max-height: 80%;
        padding: 4px;
        background: white;
        border: 2px solid black;
    }
`;
document.head.appendChild(style);

// Add dark mode toggle
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = 'Toggle Dark Mode';
darkModeToggle.classList.add('fixed', 'top-4', 'right-4', 'bg-gray-200', 'dark:bg-gray-700', 'p-2', 'rounded');
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// Check for user's preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

