/**
 * ELITE FIT - Main JavaScript
 * Handles: Slider, Smooth Scroll, Animations, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
    
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
    gsap.registerPlugin(ScrollTrigger);

    // A. Split Text Reveal (Headings)
    const splitTypes = document.querySelectorAll('[data-split-text]');
    splitTypes.forEach((char, i) => {
        const text = new SplitType(char, { types: 'words, chars' });
        
        gsap.from(text.chars, {
            scrollTrigger: {
                trigger: char,
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
        }    // 5. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                // Open Menu
                nav.style.display = 'flex';
                nav.style.position = 'fixed';
                nav.style.top = 'var(--header-height)';
                nav.style.left = '0';
                nav.style.width = '100%';
                nav.style.height = 'calc(100vh - var(--header-height))';
                nav.style.backgroundColor = 'var(--color-bg)';
                nav.style.flexDirection = 'column';
                nav.style.alignItems = 'center';
                nav.style.justifyContent = 'center';
                nav.style.zIndex = '99';
                
                // Animate links
                gsap.fromTo('.nav__item', 
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }
                );
                
                // Disable scroll
                lenis.stop();
            } else {
                // Close Menu
                nav.style.display = ''; // Revert to CSS default (none on mobile, block on desktop)
                lenis.start();
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    nav.style.display = '';
                    lenis.start();
                }
            });
        });
    }

    // 6. Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.8)';
        }
    });

    // 7. Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
        // Custom options
        animated: true,
        showClass: "f-fadeIn",
        hideClass: "f-fadeOut",
        dragToClose: false,
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
    });

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
});
