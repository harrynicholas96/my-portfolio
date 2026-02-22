/* ========================================
   CASE STUDY PAGE SPECIFIC SCRIPTS
   ======================================== */

// Custom Cursor for case study page
(function() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effect to all clickable elements using event delegation
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .nav-link, .logo');
        if (target) {
            cursor.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .nav-link, .logo');
        if (target) {
            cursor.classList.remove('hover');
        }
    });
})();

// Scroll animations for case study content
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animatable content elements (excluding hero section and tools bar)
        const elements = document.querySelectorAll('.case-container, .case-container-wide, .case-container-split, .insight-card, .process-step, .ab-card, .ab-phone, .impact-card, .solution-grid, .solution-phone, .solution-step, .outcome-card');
        elements.forEach(element => {
            observer.observe(element);
        });
    }
})();

// Scroll Spy Navigation for Case Study
(function() {
    // Wait for DOM and navigation to load
    setTimeout(initScrollSpy, 100);

    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) {
            // Navigation might not be loaded yet, try again
            setTimeout(initScrollSpy, 100);
            return;
        }

        // Function to update active nav link
        function updateActiveLink() {
            let currentSection = 'overview'; // Default to first section
            const scrollPosition = window.scrollY;

            // Check each section from bottom to top to find the active one
            // This ensures we always highlight the section the user has scrolled past
            const sectionsArray = Array.from(sections);
            for (let i = sectionsArray.length - 1; i >= 0; i--) {
                const section = sectionsArray[i];
                const sectionTop = section.offsetTop - 150; // Offset for fixed nav

                if (scrollPosition >= sectionTop) {
                    currentSection = section.getAttribute('id');
                    break;
                }
            }

            // Find the link that should be active
            let targetLink = null;
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === '#' + currentSection) {
                    targetLink = link;
                }
            });

            // If we found a matching link, update active states and move underline
            if (targetLink) {
                navLinks.forEach(link => {
                    if (link === targetLink) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Move the sliding underline to the active link
                const underline = document.querySelector('.nav-underline');
                const navLinksContainer = targetLink.closest('.nav-links');

                if (underline && navLinksContainer) {
                    const linkRect = targetLink.getBoundingClientRect();
                    const containerRect = navLinksContainer.getBoundingClientRect();
                    const scrollLeft = navLinksContainer.scrollLeft;

                    underline.style.left = (linkRect.left - containerRect.left + scrollLeft + 12) + 'px';
                    underline.style.width = (linkRect.width - 24) + 'px';

                    // Scroll active link into view on mobile
                    if (window.innerWidth <= 768) {
                        const linkCenter = linkRect.left - containerRect.left + (linkRect.width / 2);
                        const containerCenter = containerRect.width / 2;

                        navLinksContainer.scrollTo({
                            left: scrollLeft + linkCenter - containerCenter,
                            behavior: 'smooth'
                        });
                    }
                }
            }
            // If no match found, don't change anything - keep current active state
        }

        // Listen to scroll events with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(updateActiveLink);
        });

        // Set initial active state
        updateActiveLink();
    }
})();
