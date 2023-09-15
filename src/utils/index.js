// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b;

// Gets the mouse position
const getMousePos = e => {
    return {
        x: e.clientX,
        y: e.clientY
    };
};

const calcWinsize = () => {
    return { width: window.innerWidth, height: window.innerHeight };
};

const distance = (x1, y1, x2, y2) => {
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.hypot(a, b);
}

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


export {
    lerp,
    calcWinsize,
    getMousePos,
    distance,
    isIndexOrSlider,
    disableLinks,
    registerGsapEffects
};