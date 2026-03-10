addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    let stop_move = null;
        document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            stop_move = animaster().move(block, 1000, {x: 100, y: 10});
        }); 
    
    document.getElementById('moveReset')
    .addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        stop_move();
    });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
}


function animaster() {
    const resetFadeIn = (element) => {
        element.style.show = null;
        element.style.hide = null;    
    }
    const resetFadeOut = (element) => {
        element.style.show = null;
        element.style.hide = null;    
    }
    const resetMoveAndScale = (element) => {
        console.log(element);
        element.style.transform = null;  
    }
    return {
        fadeIn: (element, duration) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move: (element, duration, translation) => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return () => {resetMoveAndScale(element)};
        },
        scale: (element, duration, ratio) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut: (element, duration) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }
    }
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
