/* ========================================
   PORTFOLIO SCRIPTS - Harry Nicholas
   Product Designer Portfolio
   ======================================== */

// Hero Canvas Animation
(function() {
    var width, height, canvas, ctx, points, target, animateHeader = true;

    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        var hero = document.querySelector('.hero');
        width = hero.offsetWidth;
        height = hero.offsetHeight;
        target = {x: width / 2, y: height / 2};

        canvas = document.getElementById('hero-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        points = [];
        for (var x = 0; x < width; x = x + width / 16) {
            for (var y = 0; y < height; y = y + height / 16) {
                var px = x + Math.random() * width / 16;
                var py = y + Math.random() * height / 16;
                var p = {x: px, originX: px, y: py, originY: py};
                points.push(p);
            }
        }

        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j];
                if (p1 !== p2) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] === undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        for (var i = 0; i < points.length; i++) {
            var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(110,231,183,0.3)');
            points[i].circle = c;
        }
    }

    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var hero = document.querySelector('.hero');
        var rect = hero.getBoundingClientRect();
        target.x = e.clientX - rect.left;
        target.y = e.clientY - rect.top;
    }

    function scrollCheck() {
        animateHeader = document.body.scrollTop < height || document.documentElement.scrollTop < height;
    }

    function resize() {
        var hero = document.querySelector('.hero');
        width = hero.offsetWidth;
        height = hero.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function initAnimation() {
        animate();
        for (var i = 0; i < points.length; i++) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i = 0; i < points.length; i++) {
                // Always show the animation at a consistent level
                points[i].active = 0.15;
                points[i].circle.active = 0.4;

                // Enhance on hover
                var dist = Math.abs(getDistance(target, points[i]));
                if (dist < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if (dist < 20000) {
                    points[i].active = 0.2;
                    points[i].circle.active = 0.5;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        var duration = 1 + Math.random() * 1;
        var targetX = p.originX - 50 + Math.random() * 100;
        var targetY = p.originY - 50 + Math.random() * 100;
        var startX = p.x;
        var startY = p.y;
        var startTime = performance.now();

        function step(now) {
            var elapsed = (now - startTime) / (duration * 1000);
            if (elapsed >= 1) {
                p.x = targetX;
                p.y = targetY;
                shiftPoint(p);
                return;
            }
            var t = elapsed < 0.5 ? 2 * elapsed * elapsed : -1 + (4 - 2 * elapsed) * elapsed;
            p.x = startX + (targetX - startX) * t;
            p.y = startY + (targetY - startY) * t;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function drawLines(p) {
        if (!p.active) return;
        for (var i = 0; i < p.closest.length; i++) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(110,231,183,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        this.pos = pos;
        this.radius = rad;
        this.color = color;
        this.active = 0;
        this.draw = function() {
            if (!this.active) return;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(110,231,183,' + this.active + ')';
            ctx.fill();
        };
    }

    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
})();

// Badge Text Rotation
(function() {
    const taglines = [
        'Senior Product Designer',
        'Design Thinker',
        'User Empath',
        'Visual Storyteller',
        'UI Crafter'
    ];
    let currentIndex = 0;
    const badgeText = document.querySelector('.badge-text');

    function updateBadge() {
        // Remove animation to reset
        badgeText.style.animation = 'none';

        // Force reflow
        void badgeText.offsetWidth;

        // Update text
        badgeText.textContent = taglines[currentIndex];

        // Re-apply animation
        badgeText.style.animation = 'rollUp 2s ease-in-out';

        // Move to next tagline
        currentIndex = (currentIndex + 1) % taglines.length;
    }

    // Start the rotation
    setInterval(updateBadge, 2000);
})();

// Custom Cursor
(function() {
    const cursor = document.querySelector('.custom-cursor');
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

// Scroll Animations
(function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }

    function initScrollAnimations() {
        // Adjust rootMargin based on screen size - trigger earlier on mobile
        const isMobile = window.innerWidth <= 768;
        const observerOptions = {
            threshold: 0.15,
            rootMargin: isMobile ? '0px 0px 100px 0px' : '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a slight delay before triggering animation
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, 225);
                    // Unobserve after animating to ensure it only happens once
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe content within sections instead of sections themselves (images remain static, only text animates)
        const elements = document.querySelectorAll('.about-content, #work .project-content, .clients-grid');
        elements.forEach(el => {
            // Check if element is already in viewport on page load
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100 && rect.bottom >= 0;

            if (isVisible) {
                // If already visible on load, animate immediately
                el.classList.add('animate-in');
            } else {
                // If not visible, observe it for when it enters viewport
                observer.observe(el);
            }
        });
    }
})();

// Hover Animation on Scroll for About Me Image
(function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHoverAnimations);
    } else {
        initHoverAnimations();
    }

    function initHoverAnimations() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const hoverObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add the play-hover class to trigger the animation
                    setTimeout(() => {
                        entry.target.classList.add('play-hover');
                    }, 100);
                    // Unobserve after animating to ensure it only happens once
                    hoverObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe only the about image
        const aboutImage = document.querySelector('.about-image');

        if (aboutImage) {
            // Check if element is already in viewport on page load
            const rect = aboutImage.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 50 && rect.bottom >= 0;

            if (!isVisible) {
                // If not visible, observe it for when it enters viewport
                hoverObserver.observe(aboutImage);
            }
        }
    }
})();

// Scroll Spy Navigation
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
            let currentSection = '';
            const scrollPosition = window.scrollY;

            // Check each section to see which one is currently in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 80; // Offset for fixed nav
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // If we're at the very top, set home as active
            if (scrollPosition < 100) {
                currentSection = 'home';
            }

            // Update nav links and sliding underline
            let activeLink = null;
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');

                // Check if this link points to the current section
                if (href.includes('#' + currentSection) ||
                    (currentSection === 'home' && (href === 'index.html' || href === '#home'))) {
                    link.classList.add('active');
                    activeLink = link;
                }
            });

            // Move the sliding underline to the active link
            if (activeLink) {
                const underline = document.querySelector('.nav-underline');
                const navLinksContainer = activeLink.closest('.nav-links');

                if (underline && navLinksContainer) {
                    const linkRect = activeLink.getBoundingClientRect();
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
