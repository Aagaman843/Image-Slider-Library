class Slider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.track = this.container.querySelector('.slider-track');
        this.slides = Array.from(this.track.children);
        this.nextBtn = this.container.querySelector('.next');
        this.prevBtn = this.container.querySelector('.prev');
        this.dotsContainer = this.container.querySelector('.dots-container');

        this.currentIndex = 1; // Start at 1 because of the clone
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.setupClones();
        this.createDots();
        this.updatePosition(false);

        // Event Listeners
        this.nextBtn.addEventListener('click', () => this.moveNext());
        this.prevBtn.addEventListener('click', () => this.movePrev());
        
        // Handle Infinite Loop Jump
        this.track.addEventListener('transitionend', () => this.handleBoundaryJump());
    }

    setupClones() {
        // Clone first and last slides for seamless looping
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true);

        this.track.appendChild(firstClone);
        this.track.insertBefore(lastClone, this.slides[0]);

        // Refresh allSlides count
        this.allSlidesCount = this.track.children.length;
    }

    createDots() {
        this.slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.currentIndex = i + 1;
                this.updatePosition();
            });
            this.dotsContainer.appendChild(dot);
        });
        this.updateDots();
    }

    updatePosition(animate = true) {
        this.track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateDots();
    }

    updateDots() {
        const dots = Array.from(this.dotsContainer.children);
        dots.forEach(d => d.classList.remove('active'));
        
        let activeIndex = this.currentIndex - 1;
        if (this.currentIndex === 0) activeIndex = dots.length - 1;
        if (this.currentIndex === this.allSlidesCount - 1) activeIndex = 0;
        
        if (dots[activeIndex]) dots[activeIndex].classList.add('active');
    }

    moveNext() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex++;
        this.updatePosition();
    }

    movePrev() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex--;
        this.updatePosition();
    }

    handleBoundaryJump() {
        this.isTransitioning = false;
        
        if (this.currentIndex === this.allSlidesCount - 1) {
            this.currentIndex = 1;
            this.updatePosition(false);
        }
        
        if (this.currentIndex === 0) {
            this.currentIndex = this.allSlidesCount - 2;
            this.updatePosition(false);
        }
    }
}

new Slider('image-slider');