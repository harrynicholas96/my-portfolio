/* ========================================
   FOOTER LOADER
   Dynamically loads footer from config
   ======================================== */

(function() {
    // Load footer config and render
    fetch('config/footer-config.json')
        .then(response => response.json())
        .then(config => {
            renderFooter(config);
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });

    function renderFooter(config) {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Build footer content
        const footerContent = document.createElement('div');
        footerContent.className = 'footer-content';

        // Left side
        const footerLeft = document.createElement('div');
        footerLeft.className = 'footer-left';

        // Hero image
        const heroImage = document.createElement('img');
        heroImage.src = config.heroImage.src;
        heroImage.alt = config.heroImage.alt;
        heroImage.className = 'footer-hero-image';
        footerLeft.appendChild(heroImage);

        // Title
        const title = document.createElement('h2');
        title.className = 'footer-title';
        // Replace "great" with green-colored span
        const headingWithColor = config.heading.replace(
            'great',
            '<span style="color: #10b981;">great</span>'
        );
        title.innerHTML = headingWithColor;
        footerLeft.appendChild(title);

        // Text
        const text = document.createElement('p');
        text.className = 'footer-text';
        text.textContent = config.text;
        footerLeft.appendChild(text);

        footerContent.appendChild(footerLeft);

        // Right side
        const footerRight = document.createElement('div');
        footerRight.className = 'footer-right';

        config.contact.forEach(item => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';

            if (item.type === 'email') {
                contactItem.onclick = () => window.location.href = item.action;
            } else if (item.type === 'linkedin') {
                contactItem.onclick = () => window.open(item.action, '_blank');
            }

            // Create icon
            if (item.icon === 'svg' && item.type === 'email') {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '32');
                svg.setAttribute('height', '32');
                svg.setAttribute('viewBox', '0 0 24 24');
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
                svg.setAttribute('stroke-width', '2');

                const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path1.setAttribute('d', 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z');

                const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                path2.setAttribute('points', '22,6 12,13 2,6');

                svg.appendChild(path1);
                svg.appendChild(path2);
                contactItem.appendChild(svg);
            } else {
                const img = document.createElement('img');
                img.src = item.icon;
                img.alt = item.text;
                img.width = 32;
                img.height = 32;
                contactItem.appendChild(img);
            }

            // Create text
            const span = document.createElement('span');
            span.className = 'contact-text';
            span.textContent = item.text;
            contactItem.appendChild(span);

            footerRight.appendChild(contactItem);
        });

        footerContent.appendChild(footerRight);

        // Footer bottom
        const footerBottom = document.createElement('div');
        footerBottom.className = 'footer-bottom';

        const copyright = document.createElement('p');
        copyright.className = 'copyright';
        // Automatically update copyright year
        const currentYear = new Date().getFullYear();
        copyright.textContent = `© ${currentYear} Harry Nicholas`;
        footerBottom.appendChild(copyright);

        const logoFooter = document.createElement('div');
        logoFooter.className = 'logo-footer';

        // Split "harrynicholas" into "harry" (white) and "nicholas" (green)
        const firstPart = document.createElement('span');
        firstPart.textContent = 'harry';
        firstPart.style.color = '#ffffff';

        const secondPart = document.createElement('span');
        secondPart.textContent = 'nicholas';
        secondPart.style.color = '#10b981';

        logoFooter.appendChild(firstPart);
        logoFooter.appendChild(secondPart);
        footerBottom.appendChild(logoFooter);

        // Clear existing footer and add new
        footer.innerHTML = '';
        footer.appendChild(footerContent);
        footer.appendChild(footerBottom);

        // Initialize footer animation after content is loaded
        initFooterAnimation();
    }

    // Footer scroll animation
    function initFooterAnimation() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Adjust rootMargin based on screen size - trigger earlier on mobile
        const isMobile = window.innerWidth <= 768;
        const observerOptions = {
            threshold: 0.1,
            rootMargin: isMobile ? '0px 0px 100px 0px' : '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(footer);
    }
})();
