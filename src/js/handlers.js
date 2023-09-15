import ButtonCtrl from './customButton.js';

export function sliderHandler() {
    const swiperInstance = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        direction: 'horizontal',
        spaceBetween: 20,
        speed: 1000,
        height: 800,
        centeredSlides: true,
        keyboard: {
            enabled: true,
        },
        navigation: {
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
        },
    })
    //FOR FUTURE OPTIMIZATION.
    // loadLottieAnimation(0);

    // swiperInstance.on('slideChange', () => {
    //     const activeSlideIndex = swiperInstance.activeIndex;
    //     loadLottieAnimation(activeSlideIndex);
    //     // Load Lottie animation for the next slide (if it exists)
    //     if (activeSlideIndex < swiperInstance.slides.length - 1) {
    //         loadLottieAnimation(activeSlideIndex + 1);
    //     }
    // });

    // function loadLottieAnimation(slideIndex) {
    //     const activeSlide = swiperInstance.slides[slideIndex];
    //     const lottiePlayer = activeSlide.querySelector('.swiper-slide__lottie');

    //     if (lottiePlayer) {
    //         const lottiePath = lottiePlayer.previousSibling.getAttribute('lottie-path')
    //         lottiePlayer.load(lottiePath)
    //     }
    // }
    const showCarouselButton = document.querySelector('.company__button');
    const carouselContainer = document.querySelector('.swiper-container');
    showCarouselButton.addEventListener('click', showCarousel);
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Spacebar') {
            if (swiperInstance && swiperInstance instanceof Swiper) {
                swiperInstance.slideNext();
            }
        }
    });
    function showCarousel() {
        const t1 = gsap.timeline({ clearProps: 'y', onComplete: () => document.querySelector('.company__button').remove() })
        t1.to('.company__wrapper', { x: '-400%', opacity: 0, duration: 2, ease: "power4.inOut" })
        t1.to(carouselContainer, {
            right: '0',
            duration: 2,
            ease: "power4.inOut",
        }, 0);
        t1.from('.swiper-slide.swiper-slide-active .swiper-slide__buttons', { y: '-400%', }, 1.5)
        t1.fromTo('.swiper-slide.swiper-slide-active .home-button', { y: '-400%', }, { y: '0%', opacity: 1 }, 1.5)
        t1.from('.slider__bottomText', { y: '100%', opacity: 0 }, 1.5);
    }
}


export function accordionHandler() {
    let isAccordionOpen = false;
    const timeline = gsap.timeline();
    const accordionOpenTrigger = document.querySelector('.accordion-trigger');
    const accordionCloseTrigger = document.querySelector('.greeting-wrapper__accordion_close-trigger');
    const accordionWrapper = document.querySelector('.greeting-wrapper__accordion');
    const accordionContent = document.querySelector('.greeting-wrapper__accordion-content');
    const accordionLinks = Array.from(document.querySelectorAll('.greeting-wrapper__social-link svg'));
    const bookImage = document.querySelector('.greeting-wrapper__sub-info img');

    function onAccordionClick(e) {
        e.preventDefault()
        if (isAccordionOpen) {
            gsap.effects.fadeOut(accordionCloseTrigger, { delay: 0 })
            gsap.effects.fadeOut(accordionContent)
            gsap.effects.scaleOut(bookImage)
            gsap.to(accordionLinks, { transform: 'scale(0)', ease: 'power1.out', opacity: 0, stagger: 0.1, clearProps: "all" },
            );
            gsap.to(accordionWrapper, { height: 0, 'z-index': -1, duration: 0.4, delay: 0.4 });
        } else {
            gsap.to(accordionWrapper, { height: 'auto', 'z-index': 1, duration: 0.5 });
            gsap.effects.fadeIn(accordionCloseTrigger, { delay: 0.5 })
            gsap.effects.fadeIn(accordionContent, { delay: 0.5 })
            gsap.effects.scaleIn(bookImage, { delay: 0.5 })
            gsap.from(accordionLinks, { transform: 'scale(0)', ease: 'power4.out', delay: 0.3, opacity: 0, stagger: 0.2, clearProps: "all" },
            );
        }
        isAccordionOpen = !isAccordionOpen;
    }

    accordionOpenTrigger.addEventListener('click', onAccordionClick);
    accordionCloseTrigger.addEventListener('click', onAccordionClick);
}

export function customButtonHandler() {
    let currentPage = `${window.location.pathname}`;
    if (currentPage != '/') {
        new ButtonCtrl(document.querySelector('.company__button'));
    }
}