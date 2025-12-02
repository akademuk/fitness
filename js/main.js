/**
 * ELITE FIT - Main JavaScript
 * Handles: Slider, Smooth Scroll, Animations, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Check for required libraries
    const hasGSAP = typeof gsap !== 'undefined';
    const hasSwiper = typeof Swiper !== 'undefined';
    const hasLenis = typeof Lenis !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (hasGSAP && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Initialize Lenis (Smooth Scroll)
    let lenis;
    if (hasLenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        if (hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        if (hasGSAP) {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 2. Initialize Swiper (Hero)
    const animateHeroSlide = (slide) => {
        if (!slide) return;
        
        const img = slide.querySelector('img');
        const title = slide.querySelector('.hero-title');
        const subtitle = slide.querySelector('.hero-subtitle');
        
        if (hasGSAP) {
            // Kill CSS animations and existing tweens
            if (title) {
                title.style.animation = 'none';
                title.style.opacity = '0';
            }
            if (subtitle) {
                subtitle.style.animation = 'none';
                subtitle.style.opacity = '0';
            }
            
            gsap.killTweensOf([img, title, subtitle]);

            // Animate Image
            if (img) {
                gsap.fromTo(img, 
                    { scale: 1.2 },
                    { scale: 1, duration: 6, ease: "power1.out" }
                );
            }
            
            // Animate Text
            if (title || subtitle) {
                gsap.fromTo([title, subtitle].filter(el => el), 
                    { y: 50, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 1, 
                        stagger: 0.2, 
                        ease: "power3.out", 
                        delay: 0.5 
                    }
                );
            }
        }
    };

    if (hasSwiper) {
        const heroSwiper = new Swiper('.hero-slider', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            speed: 1500,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            observer: true, 
            observeParents: true,
            on: {
                init: function() {
                    animateHeroSlide(this.slides[this.activeIndex]);
                },
                slideChangeTransitionStart: function () {
                    animateHeroSlide(this.slides[this.activeIndex]);
                }
            }
        });

        // 3. Initialize Swiper (Testimonials)
        const testimonialSwiper = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // 4. GSAP Scroll Animations
    if (hasGSAP && hasScrollTrigger) {
        // Defer ScrollTrigger registration slightly to allow initial render
        setTimeout(() => {
            requestAnimationFrame(() => {
                // Use ScrollTrigger.matchMedia for responsive animations
                let mm = gsap.matchMedia();

                // A. Split Text Reveal (Headings)
                // Ensure fonts are loaded before splitting to avoid layout shifts and forced reflows
                document.fonts.ready.then(() => {
                    try {
                        if (typeof SplitType !== 'undefined') {
                            // Use a single SplitType instance
                            const splitInstance = new SplitType('[data-split-text]', { types: 'words, chars' });
                            
                            // Add a class to mark as split to avoid FOUC
                            document.querySelectorAll('[data-split-text]').forEach(el => el.classList.add('is-split'));

                            // Iterate over the original elements to set up ScrollTriggers for each
                            document.querySelectorAll('[data-split-text]').forEach((element) => {
                                const chars = element.querySelectorAll('.char');
                                if (chars.length > 0) {
                                    gsap.from(chars, {
                                        scrollTrigger: {
                                            trigger: element,
                                            start: 'top 80%',
                                            toggleActions: 'play none none reverse'
                                        },
                                        y: 100,
                                        opacity: 0,
                                        rotation: 5,
                                        duration: 0.8,
                                        stagger: 0.02,
                                        ease: 'back.out(1.7)'
                                    });
                                }
                            });
                            
                            // Refresh ScrollTrigger after splitting
                            ScrollTrigger.refresh();
                        }
                    } catch (e) {
                        console.warn('SplitType failed to initialize', e);
                    }
                });

                // B. Standard Fade Up (Cards, etc)
                const revealElements = document.querySelectorAll('[data-reveal]');
                revealElements.forEach(element => {
                    gsap.fromTo(element, 
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 1,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: element,
                                start: 'top 85%',
                                toggleActions: 'play none none reverse'
                            }
                        }
                    );
                });

                // C. Staggered List Items
                const listItems = document.querySelectorAll('.advantages__list');
                listItems.forEach(list => {
                    const items = list.querySelectorAll('.advantage-item');
                    gsap.fromTo(items, 
                        { x: -50, opacity: 0 },
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.2,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: list,
                                start: 'top 80%',
                            }
                        }
                    );
                });

                // D. Parallax Images
                const parallaxImages = document.querySelectorAll('[data-parallax-image] img');
                parallaxImages.forEach(img => {
                    gsap.to(img, {
                        yPercent: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img.parentElement,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });
                });

                // E. Responsive Parallax (Desktop Only)
                mm.add("(min-width: 1024px)", () => {
                    gsap.to('.services__grid .service-card:nth-child(2)', {
                        y: -50,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.services__grid',
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1
                        }
                    });
                });
            });
        }, 100);
    }

    // 5. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const navCta = document.querySelector('.nav__cta');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Open Menu
                nav.classList.add('active');
                if (lenis) lenis.stop(); // Disable scroll
                
                if (hasGSAP) {
                    // Animate Links
                    gsap.fromTo('.nav__link', 
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 }
                    );

                    // Animate Footer Info
                    gsap.fromTo(['.nav__contact', '.nav__social', '.nav__cta'], 
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.6 }
                    );
                }

            } else {
                // Close Menu
                nav.classList.remove('active');
                if (lenis) lenis.start(); // Enable scroll
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    if (lenis) lenis.start();
                }
            });
        });
        
        // Close menu on CTA click
        if (navCta) {
            navCta.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    if (lenis) lenis.start();
                }
            });
        }
    }

    // 6. Header Scroll Effect (Optimized with Lenis)
    const header = document.querySelector('.header');
    let isScrolled = false;
    
    if (lenis) {
        // Use Lenis scroll event instead of window.scroll to avoid layout thrashing
        lenis.on('scroll', (e) => {
            const shouldBeScrolled = e.scroll > 50;
            
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                if (isScrolled) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
            }
        });
    } else {
        // Fallback to native scroll
        window.addEventListener('scroll', () => {
            const shouldBeScrolled = window.scrollY > 50;
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                if (isScrolled) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
            }
        });
    }

    // 6.5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (lenis) {
                    // Slower and smoother scroll
                    lenis.scrollTo(targetElement, {
                        duration: 2.0,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Close mobile menu if open
                if (window.innerWidth < 1024 && hamburger && nav) {
                     hamburger.setAttribute('aria-expanded', 'false');
                     nav.classList.remove('active');
                     if (lenis) lenis.start();
                }
            }
        });
    });

    // 7. Initialize Fancybox (Deferred & Dynamic on Scroll)
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    const loadFancybox = () => {
        loadScript('assets/vendor/js/fancybox.umd.js').then(() => {
            if (typeof Fancybox !== 'undefined') {
                Fancybox.bind("[data-fancybox]", {
                    // Custom options
                    animated: true,
                    showClass: "f-fadeIn",
                    hideClass: "f-fadeOut",
                    dragToClose: false,
                    Hash: false,
                    Images: {
                        zoom: false,
                    },
                    Toolbar: {
                        display: {
                            left: [],
                            middle: [],
                            right: ["close"],
                        },
                    },
                    Thumbs: {
                        autoStart: false,
                    },
                    on: {
                        close: () => {
                            // Remove focus to prevent accidental re-triggering
                            if (document.activeElement instanceof HTMLElement) {
                                document.activeElement.blur();
                            }
                        }
                    }
                });
            }
        }).catch(err => console.error('Failed to load Fancybox', err));
    };

    // Observer for Fancybox (Gallery or Testimonials)
    const fancyboxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadFancybox();
                fancyboxObserver.disconnect(); // Load only once
            }
        });
    }, { rootMargin: '500px' }); // Load well in advance

    const gallerySection = document.querySelector('#gallery');
    const testimonialsSection = document.querySelector('.testimonials');
    
    if (gallerySection) fancyboxObserver.observe(gallerySection);
    if (testimonialsSection) fancyboxObserver.observe(testimonialsSection);


    // 8. Phone Mask (IMask) (Deferred & Dynamic on Scroll)
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        const imaskObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const phoneInput = document.getElementById('phone');
                if (phoneInput) {
                    loadScript('assets/vendor/js/imask.js').then(() => {
                        if (typeof IMask !== 'undefined') {
                            IMask(phoneInput, {
                                mask: '+{380} (00) 000-00-00',
                                lazy: false,  // Show placeholder always
                                placeholderChar: '_'
                            });
                        }
                    }).catch(err => console.error('Failed to load IMask', err));
                }
                imaskObserver.disconnect();
            }
        }, { rootMargin: '200px' });
        
        imaskObserver.observe(bookingSection);
    }

    // 9. Custom Select Dropdown
    const customSelect = document.querySelector('.custom-select');
    const nativeSelect = document.querySelector('.form__select-native');
    
    if (customSelect && nativeSelect) {
        const trigger = customSelect.querySelector('.custom-select__trigger');
        const options = customSelect.querySelectorAll('.custom-select__option');
        const textSpan = customSelect.querySelector('.custom-select__text');

        // Toggle Dropdown
        trigger.addEventListener('click', () => {
            customSelect.classList.toggle('open');
        });

        // Select Option
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Update UI
                textSpan.textContent = text;
                customSelect.classList.remove('open');
                customSelect.classList.add('has-value');
                
                // Update Native Select
                nativeSelect.value = value;
                
                // Update Selected State
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // 10. Floating Action Button (FAB) Visibility
    // Optimized: Use IntersectionObserver instead of scroll event to avoid forced reflows
    const fab = document.querySelector('.fab-btn');
    const heroSection = document.querySelector('.hero');
    
    if (fab && heroSection) {
        const fabObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero is NOT intersecting (scrolled past), show FAB
                if (!entry.isIntersecting) {
                    fab.classList.add('visible');
                } else {
                    fab.classList.remove('visible');
                }
            });
        }, { threshold: 0 }); // Trigger as soon as even 1px of hero leaves/enters

        fabObserver.observe(heroSection);
    }

    // Animate Gallery Items on Scroll
    if (hasGSAP && hasScrollTrigger) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            gsap.fromTo(item, 
                { opacity: 0, y: 50, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1, // Stagger effect
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.gallery-mosaic',
                        start: 'top 80%',
                    }
                }
            );
        });
    }

    // 11. Form Submission Handling
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate API call/processing
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                // Reset button
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Show Success Popup
                if (typeof Fancybox !== 'undefined') {
                    Fancybox.show([{ 
                        src: "#thank-you-popup", 
                        type: "inline",
                        closeButton: false
                    }]);
                } else {
                    alert('Thank you! Your request has been sent.');
                }
                
                // Reset Form
                bookingForm.reset();
                
                // Reset Custom Select if exists
                const customSelect = document.querySelector('.custom-select');
                const customSelectText = document.querySelector('.custom-select__text');
                const customSelectOptions = document.querySelectorAll('.custom-select__option');
                
                if (customSelect && customSelectText) {
                    customSelectText.textContent = '';
                    customSelect.classList.remove('has-value');
                    customSelectOptions.forEach(opt => opt.classList.remove('selected'));
                }
                
            }, 1500);
        });
    }

    // 12. Prevent Transition Flash on Resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });

    // 13. Magnetic Buttons (Premium Feel)
    const initMagneticButtons = () => {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    duration: 0.3,
                    x: x * 0.2,
                    y: y * 0.2,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    };
    
    // Only init on desktop
    if (hasGSAP && window.matchMedia("(min-width: 1024px)").matches) {
        initMagneticButtons();
    }

    // 14. Interactive Stats Counter
    const initStatsCounter = () => {
        const stats = document.querySelectorAll('.status-rail__value');
        
        stats.forEach(stat => {
            const rawValue = stat.textContent;
            const numberMatch = rawValue.match(/[\d\.]+/);
            
            if (!numberMatch) return;
            
            const targetValue = parseFloat(numberMatch[0]);
            
            if (rawValue.includes(':')) return; 

            const suffix = rawValue.replace(numberMatch[0], '').replace('+', ''); 
            const hasPlus = rawValue.includes('+');
            const prefix = hasPlus ? '+' : '';
            
            // Reset to 0
            stat.textContent = prefix + '0' + suffix;
            
            if (hasScrollTrigger && hasGSAP) {
                ScrollTrigger.create({
                    trigger: stat,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        const obj = { val: 0 };
                        gsap.to(obj, {
                            val: targetValue,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: () => {
                                const isFloat = targetValue % 1 !== 0;
                                const current = isFloat ? obj.val.toFixed(1) : Math.round(obj.val);
                                stat.textContent = prefix + current + suffix;
                            }
                        });
                    }
                });
            }
        });
    };
    
    // Defer slightly to ensure DOM is ready
    setTimeout(initStatsCounter, 500);

    // 15. Form Input Micro-interactions (Focus Shake)
    if (hasGSAP) {
        const formInputs = document.querySelectorAll('.form__input, .form__select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                const parent = input.closest('.form__group');
                if (parent) {
                    gsap.fromTo(parent, 
                        { x: -2 }, 
                        { x: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" }
                    );
                }
            });
        });
    }

    // 16. 3D Tilt Effect for Cards (Premium Interaction)
    const init3DTilt = () => {
        const cards = document.querySelectorAll('.service-card, .coach-card, .pricing-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate rotation (max 5 degrees)
                const rotateX = ((y - centerY) / centerY) * -5; 
                const rotateY = ((x - centerX) / centerX) * 5;
                
                gsap.to(card, {
                    duration: 0.5,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    rotateX: 0,
                    rotateY: 0,
                    ease: 'power2.out'
                });
            });
        });
    };
    
    // Only init on desktop to save battery/performance on mobile
    if (hasGSAP && window.matchMedia("(min-width: 1024px)").matches) {
        init3DTilt();
    }
});
