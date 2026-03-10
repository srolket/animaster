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

    document.getElementById('movePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().move(block, 1000, {x: 100, y: 10});
    }); 
    

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    let stop_moveAndHidePlay = null;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            stop_moveAndHidePlay = animaster().moveAndHide(block, 5000);
        });
    
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            stop_moveAndHidePlay();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    let stop;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop = animaster().heartBeating(block).stop;
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop();
        });
}


function animaster() {
    const resetFadeIn = (element) => {
        element.style.show = null;
        element.classList.add('hide');  
    }
    const resetFadeOut = (element) => {
        element.classList.add('show');
        element.style.hide = null;    
    }
    const resetMoveAndScale = (element) => {
        element.style.transform = null;  
    }
    return {
        _steps: [],

        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },

        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },

        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        moveAndHide(element, duration) {
            animaster().move(element, 0.4 * duration, {x: 100, y: 20});
            animaster().fadeOut(element, 0.6 * duration);
            return () => {
                resetMoveAndScale(element); 
                resetFadeOut(element);
            };
        },

        showAndHide(element, duration) {
            animaster().fadeIn(element, duration / 3);
            setTimeout(animaster().fadeOut, duration / 3, element, duration / 3);
        },

        heartBeating(element) {
            const intervalId = setInterval(() => {
                animaster().scale(element, 500, 1.4);
                setTimeout(() => {
                    animaster().scale(element, 500, 1);
                }, 500);
            }, 1000)

            return {
                stop: () => clearInterval(intervalId)
            }
        },

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                params: translation,
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                params: ratio,
            })
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
                params: null,
            })
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
                params: null,
            })
            return this;
        },

        play(element) {
            for (step of this._steps) {
                if (step.name === 'move') {
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(step.params, null);
                } else if (step.name === 'scale') {
                    element.style.transitionDuration =  `${step.duration}ms`;
                    element.style.transform = getTransform(null, step.params);
                } else if (step.name === 'fadeIn') {
                    element.style.transitionDuration =  `${step.duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                } else if (step.name === 'fadeOut') {
                    element.style.transitionDuration =  `${step.duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            }
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
