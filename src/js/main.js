import { sliderHandler, accordionHandler, customButtonHandler } from "./handlers.js"
import {
    isIndexOrSlider,
    disableLinks,
    registerGsapEffects
} from "../utils/index.js";

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
        transform: 'translateX(-100%)',
        opacity: '0',
        delay: 0.3,
        ease: "power2.out",
        clearProps: true,
    }, 0)
    timeline.from('.main-info__experience .page-link .inline-svg', {
        duration: 1,
        stagger: 0.1,
        transform: "scale(0)",
        opacity: 0,
        ease: "power4.out",
        clearProps: 'scale',
    }, 0)
    outerTimeline.add(timeline);
}

function sliderPageTransitions(timeline = gsap.timeline(), delay) {
    const outerTimeline = gsap.timeline({ delay });
    const sliderPageLinks = document.querySelectorAll('.company__links .page-link')
    timeline.from('.company__text', {
        duration: 2,
        opacity: 0,
        x: '-50%',
        ease: "power3.in"
    }, 0)
    timeline.from('.company__logo-image', {
        duration: 2,
        y: '-100%',
        opacity: 0,
        ease: "power1.in",
        clearProps: true
    }, 0)
    timeline.from('.company__button', {
        duration: 2,
        x: '100%',
        opacity: 0,
        ease: "power1.in",
        clearProps: true
    }, 0)
    timeline.from(sliderPageLinks, {
        duration: 2,
        y: "150%",
        opacity: 0,
        ease: "power4.out",
        stagger: 0.3,
        clearProps: 'all'
    }, 0)
    timeline.from('.company__main-info .home-button svg', {
        duration: 2,
        y: '-100%',
        opacity: 0,
        ease: "power1.in",
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
    else if (currentPage.includes('wmg')) {
        currentPage = '• Warner Music Group'
    }
    else {
        currentPage = currentPage.replace(/^\/|\.html$/g, '').split('').map((el, i) => i == 0 ? `• ${el.toUpperCase()}` : el).join('')
    }
    const blackScreen = document.createElement('div');
    blackScreen.classList = 'transition-element';
    const transitionContent = document.createElement('p');
    transitionContent.classList = 'transition-element__content';
    transitionContent.textContent = currentPage;
    blackScreen.appendChild(transitionContent);
    document.body.appendChild(blackScreen);
    return blackScreen;
}

function pageOut(trEl, timeline, data, delay) {
    document.querySelector('main').setAttribute('transitionated', true)
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
            delay: 3
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
                    onComplete: () => {
                        document.querySelector('.transition-element').remove();
                        document.querySelector('main').setAttribute('transitionated', false);
                        customButtonHandler()
                    }
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
                    disableLinks()
                    customButtonHandler()
                    sliderHandler()
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
    }
});

document.addEventListener('DOMContentLoaded', () => {
    registerGsapEffects()
})

