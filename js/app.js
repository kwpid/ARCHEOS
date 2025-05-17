document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    const toggleButton = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (event) => {
        const isMobile = window.innerWidth <= 768;
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggleButton.contains(event.target);
        
        if (isMobile && !isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.add('collapsed');
        }
    });

    // Add smooth transitions for all interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(element => {
        element.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            element.appendChild(ripple);
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });

    // Add parallax effect to the main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 20;
            const y = (window.innerHeight / 2 - e.clientY) / 20;
            mainTitle.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Add typing effect to the quote
    const quote = document.querySelector('.quote');
    if (quote) {
        const text = quote.textContent;
        quote.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                quote.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
}); 