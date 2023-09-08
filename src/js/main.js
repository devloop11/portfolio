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
        speed: 900,
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
        const t1 = gsap.timeline()
        t1.to('.company__wrapper', { x: '-400%', opacity: 0, duration: 1 })
        t1.to(carouselContainer, {
            right: '0',
            duration: 1,
        }, 0);
        t1.from('.swiper-slide.swiper-slide-active .swiper-slide__buttons', { y: '-400%', })
        t1.fromTo('.swiper-slide.swiper-slide-active .home-button', { y: '-400%', }, { y: '0%', opacity: 1 }, 1)
        t1.from('.slider__buttomText', { y: '100%', opacity: 0 }, 1)
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

    function onAccordionCLick() {
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

    accordionOpenTrigger.addEventListener('click', onAccordionCLick);
    accordionCloseTrigger.addEventListener('click', onAccordionCLick);
}

function revriteGsapAnimation() {
    const experienceLinks = document.querySelectorAll('.company__links .page-link');
    experienceLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, { scale: 1.05, duration: 0.3 });

        })
        link.addEventListener('mouseleave', () => {
            gsap.to(link, { scale: 1, duration: 0.3 });
        });
    });
}

function mainPageTransitions(timeline = gsap.timeline(), offset = 0) {
    timeline.from('.main-info__greeting h1', {
        duration: 1.5,
        x: "100%",
        opacity: '0',
        ease: "Expo.easeOut",
    }, offset)
    timeline.from('.main-info__greeting span', {
        duration: 1.5,
        transform: 'translateX(-400%)',
        opacity: '0',
        delay: 0.3,
        ease: "Expo.easeOut",
    }, offset)
    timeline.from('.main-info__link svg', {
        duration: 2,
        transform: "scale(0)",
        ease: "Expo.easeOut",
    }, offset)
}

function sliderPageTransitions(timeline = gsap.timeline(), offset = 0) {
    const sliderPageLinks = document.querySelectorAll('a.page-link')
    timeline.from('.company__text', {
        duration: 1,
        opacity: 0,
        x: '-100%',
    }, offset)
    timeline.from('.company__button', {
        duration: 1,
        opacity: 0,
        x: '200%',
    }, offset)
    timeline.from(sliderPageLinks, {
        duration: 0.7,
        y: "150%",
        opacity: 0,
        stagger: 0.1
    }, offset)
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

function pageOut(trEl, timeline, data) {
    timeline.fromTo(trEl, { borderRadius: "50%", }, {
        y: '-95%',
        borderRadius: "0%",
        duration: 1,
        ease: 'power4.inOut',
    });
    timeline.from('.transition-element__content', {
        opacity: '0',
        duration: 1,
        ease: 'power1.in',
    }, 0);
}

function pageIn(trEl, timeline, data) {
    const outerTimeline = gsap.timeline({ delay: 1.1 });
    outerTimeline.add(timeline);

    if (isIndexOrSlider(data.next.container)) {
        timeline.call(mainPageTransitions, [timeline, 0.3])
    }
    else {
        timeline.call(sliderPageTransitions, [timeline, 0.3])
    }
    timeline.to('.transition-element__content', {
        opacity: '0',
        duration: 1,
        ease: 'power1.out',
    });
    timeline.fromTo('.transition-element', { borderRadius: "0%", }, {
        y: '-200%',
        borderRadius: "40%",
        duration: 1,
        ease: 'power4.inOut',
    }, 0);
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
                pageOut(pageTrEl, t1)
            },
            async enter(data) {
                window.scrollTo(0, 0);
                const t1 = gsap.timeline({
                    onComplete: () => {
                        document.querySelector('.transition-element').remove()
                    }
                })
                pageIn(document.querySelector('.transition-element'), t1, data)
            },
            once(data) {
                if (isIndexOrSlider(data.next.container)) {
                    mainPageTransitions();
                    accordionHandler()
                    return;
                }
                else {
                    revriteGsapAnimation()
                    sliderPageTransitions()
                }
            }
        },
    ],
});

barba.hooks.after((data) => {
    if (isIndexOrSlider(data.next.container)) {
        accordionHandler()
        return
    }
    else {
        disableLinks()
        sliderHandler()
        revriteGsapAnimation()
    }
});
document.addEventListener('DOMContentLoaded', () => {
    disableLinks()
    registerGsapEffects()
})

