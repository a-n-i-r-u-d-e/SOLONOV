AOS.init();

        // Sliding Mobile Nav Logic
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            });
        });

        // FAQ Logic
        function toggleFaq(element) {
            const answer = element.querySelector('.faq-answer');
            const icon = element.querySelector('i');
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                answer.style.marginTop = "0";
                icon.className = "fas fa-plus";
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.marginTop = "1rem";
                icon.className = "fas fa-minus";
            }
        }

        // --- ADDED: MAGNETIC FIELD ANIMATION JS ---
        const canvas = document.getElementById('magnetic-canvas');
        const ctx = canvas.getContext('2d');
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Touch and Mouse Listeners
        window.addEventListener('mousemove', e => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        window.addEventListener('touchmove', e => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchstart', e => {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }, { passive: true });

        // Reset when touch ends
        window.addEventListener('touchend', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => { resize(); initNeedles(); });
        resize();

        class Needle {
            constructor(x, y) { this.x = x; this.y = y; }
            draw() {
                const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
                const dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
                const opacity = Math.max(0.1, 1 - dist / 600);
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);
                // Color shift based on distance
                ctx.strokeStyle = dist < 200 ? '#39ff14' : (dist < 500 ? '#0ff' : '#bc13fe');
                ctx.globalAlpha = opacity;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
                ctx.stroke();
                ctx.restore();
            }
        }

        let needles = [];
        // Adjust spacing for mobile performance
        const spacing = window.innerWidth < 768 ? 45 : 35; 

        function initNeedles() {
            needles = [];
            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    needles.push(new Needle(x, y));
                }
            }
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            needles.forEach(n => n.draw());
            requestAnimationFrame(animate);
        }
        initNeedles();
        animate();