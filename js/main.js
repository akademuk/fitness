/**
 * ELITE FIT - Main JavaScript
 * Handles: Slider, Smooth Scroll, Animations, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Helper: Load scripts dynamically
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

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 2. Initialize Swiper (Hero)
    const heroSwiper = new Swiper('.hero-slider', {
        effect: 'fade',
        speed: 1500,
        autoplay: {
            delay: 6000,
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
        on: {
            slideChangeTransitionStart: function () {
                // Zoom effect on background image
                const activeSlide = this.slides[this.activeIndex];
                const img = activeSlide.querySelector('img');
                gsap.fromTo(img, 
                    { scale: 1.2 }, 
                    { scale: 1, duration: 6, ease: "power1.out" }
                );
                
                // Text Reveal
                const title = activeSlide.querySelector('.hero-title');
                const subtitle = activeSlide.querySelector('.hero-subtitle');
                
                gsap.fromTo([title, subtitle], 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 }
                );
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

    // 4. GSAP Scroll Animations
    // Defer ScrollTrigger registration slightly to allow initial render
    setTimeout(() => {
        gsap.registerPlugin(ScrollTrigger);

        // A. Split Text Reveal (Headings)
        // Use a single SplitType instance for all elements to minimize layout thrashing
        // SplitType will process them in a batch
        try {
            const splitInstance = new SplitType('[data-split-text]', { types: 'words, chars' });
            
            // Iterate over the original elements to set up ScrollTriggers for each
            document.querySelectorAll('[data-split-text]').forEach((element) => {
                // Select only the chars belonging to this specific element
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
        } catch (e) {
            console.warn('SplitType failed to initialize', e);
        }

        // Refresh ScrollTrigger once after all DOM manipulations
        ScrollTrigger.refresh();

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

        // D. Parallax Images & Asymmetric Grids
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

            // Parallax for Services Grid (Asymmetry)
            if (window.innerWidth > 1024) {
                gsap.to('.services__grid .service-card:nth-child(2)', {
                    y: -50, // Move up slightly against the scroll
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.services__grid',
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }
    }, 50);    // 5. Mobile Menu Toggle
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
                lenis.stop(); // Disable scroll
                
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

            } else {
                // Close Menu
                nav.classList.remove('active');
                lenis.start(); // Enable scroll
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    lenis.start();
                }
            });
        });
        
        // Close menu on CTA click
        if (navCta) {
            navCta.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    lenis.start();
                }
            });
        }
    }

    // 6. Header Scroll Effect
    const header = document.querySelector('.header');
    let isScrolled = false;
    
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

    // 6.5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Slower and smoother scroll
                lenis.scrollTo(targetElement, {
                    duration: 2.0,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                
                // Close mobile menu if open
                if (window.innerWidth < 1024 && hamburger && nav) {
                     hamburger.setAttribute('aria-expanded', 'false');
                     nav.classList.remove('active');
                     lenis.start();
                }
            }
        });
    });

    // 7. Initialize Fancybox (Deferred & Dynamic on Scroll)
    const loadFancybox = () => {
        loadScript('assets/vendor/js/fancybox.umd.js').then(() => {
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
                        IMask(phoneInput, {
                            mask: '+{380} (00) 000-00-00',
                            lazy: false,  // Show placeholder always
                            placeholderChar: '_'
                        });
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
    const fab = document.querySelector('.fab-btn');
    const heroSection = document.querySelector('.hero');
    
    if (fab && heroSection) {
        window.addEventListener('scroll', () => {
            // Show FAB after scrolling past hero section
            if (window.scrollY > heroSection.offsetHeight) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        });
    }

    // Animate Gallery Items on Scroll
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
                Fancybox.show([{ 
                    src: "#thank-you-popup", 
                    type: "inline",
                    closeButton: false
                }]);
                
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
});
