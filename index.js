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
        if (stop_moveAndHidePlay) {
            stop_moveAndHidePlay.reset(); 
        }
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

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();
    

    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);

    const borderRadiusHandler = animaster()
        .addBorderRadius(1000, 50)
        .addBorderRadius(1000, 0)
        .buildHandler();
    

    document.getElementById('borderRadiusBlock')
        .addEventListener('click', borderRadiusHandler);
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
            return this.addMove(duration * 0.4, { x: 100, y: 20 })
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
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

        addBorderRadius(duration, ratio) {
            this._steps.push({
                name: 'borderRadius',
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

        addDelay(duration) {
            this._steps.push({ name: 'delay', duration });
            return this;
        },

        play(element, cycled = false) {
            let isStopped = false;
            let timeouts = [];

            const run = () => {
                let currentDelay = 0;

                this._steps.forEach(step => {
                    const timeoutId = setTimeout(() => {
                        if (isStopped) return;

                        element.style.transitionDuration = `${step.duration}ms`;

                        switch (step.name) {
                            case 'move':
                                element.style.transform = getTransform(step.params, null);
                                break;
                            case 'scale':
                                element.style.transform = getTransform(null, step.params);
                                break;
                            case 'borderRadius':
                                element.style.borderRadius = step.params + 'px';
                                break;
                            case 'fadeIn':
                                element.classList.remove('hide');
                                element.classList.add('show');
                                break;
                            case 'fadeOut':
                                element.classList.remove('show');
                                element.classList.add('hide');
                                break;
                            case 'delay':
                                break;
                        }
                    }, currentDelay);

                    timeouts.push(timeoutId);
                    currentDelay += step.duration;
                });

                if (cycled && !isStopped) {
                    const cycleTimeout = setTimeout(run, currentDelay);
                    timeouts.push(cycleTimeout);
                }
            };

            run();

            return {
                stop: () => {
                    isStopped = true;
                    timeouts.forEach(clearTimeout);
                },
                reset: () => {
                    isStopped = true;
                    timeouts.forEach(clearTimeout);
                    resetMoveAndScale(element);
                    element.classList.remove('show', 'hide');
                }
            };
        },

        buildHandler() {
            return (event) => { 
                this.play(event.currentTarget); 
            };
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
