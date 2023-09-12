import ButtonCtrl from './customButton.js';

function registerGsapEffects() {
    gsap.registerEffect({
        name: "fadeIn",
        effect: (targets, config) => {
            return gsap.to(targets, { duration: config.duration, opacity: 1, delay: config.delay });
        },
        defaults: { duration: 0.4 },
    });
    gsap.registerEffect({
        name: "fadeOut",
        effect: (targets, config) => {
            return gsap.to(targets, { duration: config.duration, opacity: 0, delay: config.delay });
        },
        defaults: { duration: 0.4 },
    });
    gsap.registerEffect({
        name: "scaleOut",
        effect: (targets, config) => {
            return gsap.to(targets, { duration: config.duration, transform: "scale(0)", delay: config.delay });
        },
        defaults: { duration: 0.5 },
    });
    gsap.registerEffect({
        name: "scaleIn",
        effect: (targets, config) => {
            return gsap.to(targets, { duration: config.duration, transform: "scale(1)", delay: config.delay });
        },
        defaults: { duration: 0.5 },
    });
}

function isIndexOrSlider(currentPage) {
    if (currentPage.contains(document.querySelector('.main-info'))) {
        return true
    }
    return false
}

function disableLinks() {
    const pageLinks = Array.from(document.querySelectorAll('.page-link'));
    pageLinks.forEach(el => {
        if (el.getAttribute('href') == window.location.pathname.replace('/', '')) {
            el.classList.add('disabled')
        }
    })
}

function sliderHandler() {
    new Swiper('.swiper-container', {
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
    const showCarouselButton = document.querySelector('.company__button');
    const carouselContainer = document.querySelector('.swiper-container');
    showCarouselButton.addEventListener('click', showCarousel);
    function showCarousel() {
        const t1 = gsap.timeline({ onComplete: () => document.querySelector('.company__button').remove() })
        t1.to('.company__wrapper', { x: '-400%', opacity: 0, duration: 2, ease: "power4.inOut" })
        t1.to(carouselContainer, {
            right: '0',
            duration: 2,
            ease: "power4.inOut"
        }, 0);
        t1.from('.swiper-slide.swiper-slide-active .swiper-slide__buttons', { y: '-400%', }, 1.5)
        t1.fromTo('.swiper-slide.swiper-slide-active .home-button', { y: '-400%', }, { y: '0%', opacity: 1 }, 1.5)
        t1.from('.slider__buttomText', { y: '100%', opacity: 0 }, 1.5)
    }
}

function accordionHandler() {
    let isAccordionOpen = false;
    const timeline = gsap.timeline();
    const accordionOpenTrigger = document.querySelector('.accordion-trigger');
    const accordionCloseTrigger = document.querySelector('.greeting-wrapper__accordion_close-trigger');
    const accordionWrapper = document.querySelector('.greeting-wrapper__accordion');
    const accordionContent = document.querySelector('.greeting-wrapper__accordion-content');
    const accordionLinks = document.querySelectorAll('.greeting-wrapper__social-link');
    const bookImage = document.querySelector('.greeting-wrapper__sub-info img');

    function onAccordionClick(e) {
        e.preventDefault()
        if (isAccordionOpen) {
            gsap.effects.fadeOut(accordionCloseTrigger, { delay: 0 })
            gsap.effects.fadeOut(accordionContent)
            gsap.effects.scaleOut(bookImage)
            timeline.staggerTo(
                accordionLinks,
                0.4,
                { transform: 'scale(0)', ease: 'power1.out' },
                0.1
            );
            gsap.to(accordionWrapper, { height: 0, 'z-index': -1, duration: 0.4, delay: 0.4 });
        } else {
            gsap.to(accordionWrapper, { height: 'auto', 'z-index': 1, duration: 0.5 });
            gsap.effects.fadeIn(accordionCloseTrigger, { delay: 0.5 })

            gsap.effects.fadeIn(accordionContent, { delay: 0.5 })
            gsap.effects.scaleIn(bookImage, { delay: 0.5 })
            timeline.staggerTo(
                accordionLinks,
                0.4,
                { transform: 'scale(1)', ease: 'power1.out', delay: 0.5 },
                0.2
            );
        }
        isAccordionOpen = !isAccordionOpen;
    }

    accordionOpenTrigger.addEventListener('click', onAccordionClick);
    accordionCloseTrigger.addEventListener('click', onAccordionClick);
}


function mainPageTransitions(timeline = gsap.timeline(), delay) {
    const outerTimeline = gsap.timeline({ delay });
    timeline.from('.main-info__container', {
        duration: 3,
        opacity: '0',
        ease: "power4.out",
    })
    timeline.from('.greeting-wrapper__video', {
        duration: 3,
        x: "-200%",
        opacity: '0',
        ease: "power4.out",
    }, 0)
    timeline.from('.main-info__greeting h1', {
        duration: 3,
        x: "100%",
        opacity: '0',
        ease: "power4.out",
    }, 0)
    timeline.from('.main-info__greeting a', {
        duration: 3,
        transform: 'translateX(-400%)',
        opacity: '0',
        delay: 0.3,
        ease: "power4.out",
        clearProps: true,
    }, 0)
    timeline.from('.main-info__experience .page-link', {
        duration: 1,
        stagger: 0.1,
        transform: "scale(0)",
        opacity: 0,
        ease: "power4.out",
        clearProps: true,
    }, 0)
    outerTimeline.add(timeline);
}

function sliderPageTransitions(timeline = gsap.timeline(), delay) {
    const outerTimeline = gsap.timeline({ delay });
    const sliderPageLinks = document.querySelectorAll('.company__links .page-link')
    timeline.from('.company__text', {
        duration: 2.5,
        opacity: 0,
        x: '-100%',
        ease: "power4.out"
    }, 0)
    timeline.from('.company__button', {
        duration: 2.5,
        x: '120%',
        opacity: 0,
        ease: "power4.out",
        clearProps: true
    }, 0)
    timeline.from(sliderPageLinks, {
        duration: 2.5,
        y: "150%",
        opacity: 0,
        ease: "power4.out",
        stagger: 0.2,
        clearProps: true
    }, 0)
    timeline.from('.company__main-info .home-button svg', {
        duration: 2.5,
        y: '-100%',
        opacity: 0,
        ease: "power4.out",
        clearProps: true
    }, 0)
    sliderPageLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { transform: 'scale(1.05)', duration: 0.3 })
        })
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { transform: 'scale(1)', duration: 0.3 })
        })
    })
    outerTimeline.add(timeline)
}

function transitionElBetweenPages() {
    let currentPage = `${window.location.pathname}`;
    if (currentPage == '/') {
        currentPage = '• Home'
    }
    else {
        currentPage = currentPage.replace(/^\/|\.html$/g, '').split('').map((el, i) => i == 0 ? `• ${el.toUpperCase()}` : el).join('')
    }
    const blackScreen = document.createElement('div');
    blackScreen.classList = 'transition-element';
    const transitionContent = document.createElement('p');
    transitionContent.classList = 'transition-element__content';
    transitionContent.textContent = currentPage;
    blackScreen.appendChild(transitionContent)
    document.body.appendChild(blackScreen);
    return blackScreen;
}

function pageOut(trEl, timeline, data, delay) {
    const outerTimeline = gsap.timeline({ delay });
    outerTimeline.add(timeline);
    if (!isIndexOrSlider(data.current.container)) {
        gsap.to(data.current.container, {
            y: '-30%',
            opacity: '0',
            duration: 1.5,
            ease: 'expo.in',
        });
    }
    else {
        gsap.to(data.current.container.querySelector('.main-info__container'), {
            y: '-40%',
            opacity: '0',
            duration: 1.5,
            ease: 'expo.in',
        });
    }
    timeline.fromTo('.transition-element', { borderRadius: "100% 100% 0 0", }, {
        y: '-100%',
        borderRadius: "0 0 0 0",
        duration: 1.5,
        ease: "expo.in",
    });
    timeline.from('.transition-element__content', {
        opacity: '0',
        duration: 1,
        ease: "expo.in",
    }, 0.5);
}

function pageIn(trEl, timeline, data, delay) {
    console.log(data.next.container.querySelector('.company__wrapper'))
    const outerTimeline = gsap.timeline({ delay });
    outerTimeline.add(timeline);
    const nextPageTransition = isIndexOrSlider(data.next.container) ? mainPageTransitions : sliderPageTransitions
    timeline.to('.transition-element__content', {
        opacity: '0',
        duration: 1.5,
        ease: "power4.out",
    });
    timeline.fromTo('.transition-element', { borderRadius: "0% 0% 10% 10% " }, {
        y: '-200%',
        borderRadius: "0% 0% 100% 100%",
        duration: 2,
        ease: "expo.out",
    }, 1);
    if (!isIndexOrSlider(data.next.container)) {
        gsap.from(data.next.container, {
            y: '100%',
            opacity: '0',
            duration: 2,
            ease: 'expo.out',
            clearProps: true,
            delay: 3
        })
    }
    else {
        gsap.from(data.next.container.querySelector('.main-info__container'), {
            y: '100%',
            duration: 2,
            ease: 'expo.out',
            clearProps: true,
            delay: 3,
        });
    }
    timeline.call(nextPageTransition, [undefined, 0], 1)
}

barba.init({
    transitions: [
        {
            name: 'page-transition',
            sync: true,
            async leave(data) {
                const done = this.async();
                const pageTrEl = transitionElBetweenPages();
                const t1 = gsap.timeline({
                    onComplete: () => {
                        done()
                    }
                })
                pageOut(pageTrEl, t1, data, 0)
            },
            async enter(data) {
                window.scrollTo(0, 0);
                const t1 = gsap.timeline({
                    onComplete: () => { document.querySelector('.transition-element').remove(); customButtonHandler() }
                })
                pageIn(document.querySelector('.transition-element'), t1, data, 2)

            },
            once(data) {
                if (isIndexOrSlider(data.next.container)) {
                    mainPageTransitions();
                    accordionHandler()
                    return;
                }
                else {
                    customButtonHandler()
                    disableLinks()
                    sliderHandler()
                    sliderPageTransitions()
                }
            }
        },
    ],
});


function customButtonHandler() {
    let currentPage = `${window.location.pathname}`;
    if (currentPage != '/') {
        new ButtonCtrl(document.querySelector('.company__button'));
    }
}

barba.hooks.after((data) => {
    if (isIndexOrSlider(data.next.container)) {
        accordionHandler()
        return
    }
    else {
        disableLinks()
        sliderHandler()
    }
});
document.addEventListener('DOMContentLoaded', () => {
    disableLinks()
    registerGsapEffects()
})

