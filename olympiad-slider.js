// Olympiad Slider Class
class OlympiadSlider {
    constructor() {
        this.slides = [];
        this.currentSlide = 0;
        this.slider = null;
        this.sliderContainer = null;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000; // 8 seconds per slide by default
        this.descriptions = [];
        this.typingSpeed = 50; // milliseconds between characters
        this.currentTypingSlide = 0;
        this.typingTimeout = null;
        this.typingComplete = false;
        this.init();
    }

    init() {
        this.loadOlympiads();
        this.createSlider();
        this.setupNavigation();
        this.setupEventListeners();
        this.goToSlide(0);
    }

    loadOlympiads() {
        // Define olympiad data
        this.olympiads = [
            {
                title: "International Physics Olympiad 2024",
                image: "olympiads/International Physics Olympiad.jpg",
                description: "Pakistan team won 3 Bronze medals in 54th International Physics Olympiad (IPhO), held in Isfahan, Iran July 21-28, 2024. Mr. Talha Ashraf (Nixor College, Karachi), Mr. Huzaifa Altamash (Lahore Grammar School, Senior Boys Campus, Johar Town, Lahore), Mr. Muhammad Salman Tarar (The Science School, H-9/1, Islamabad) won Bronze Medals and Mr. Muhammad Saad Bilal (Siddeeq Public School & College, Rawalpindi) received an Honorable Mention for Pakistan."
            },
            {
                title: "International Mathematics Olympiad 2024",
                image: "olympiads/International Mathematics Olympiad 2024.jpg",
                description: "Pakistan team won Silver and Bronze medals in 65th International Mathematics Olympiad (IMO), held in Bath, United Kingdom July 11-22, 2024. Mr. Raazi Hassan Mansoor (Karachi) won a Silver medal, Muhammad Ahmad Bhatti (Karachi Grammar School, Karachi) won a Bronze medal, and Muhamad Mahad Arif (Sundar STEM School, Lahore) won an Honorable Mention for Pakistan in IMO 2024."
            },
            {
                title: "International Chemistry Olympiad 2024",
                image: "olympiads/International CHEMSITRY Olympiad 2024.jpg",
                description: "Pakistan team won a Bronze medals in 56th International Chemistry Olympiad (IChO), held in Riyadh, KSA from July 21-30, 2024. The Pakistan team participated in the Olympiad under the sponsorship of STEM Careers program, which is a joint venture of Higher Education Commission (HEC) & Pakistan Institute of Engineering and Applied Science (PIEAS)."
            },
            {
                title: "International Biology Olympiad 2024",
                image: "olympiads/International Biology Olympiad 2024.jpg",
                description: "Pakistan team won Two Bronze medals in International Biology Olympiad (IBO), held in Astana, Kazakhstan from July 7-14, 2024. Ms. Zoha Asif from Nixor college, Karachi and Mr. Soban Safdar from FFC Grammar School, Mirpur Mathelo won the bronze medal for Pakistan in IBO 2024. The Pakistan team participated in the Olympiad under the sponsorship of STEM Careers program, which is a joint venture of Higher Education Commission (HEC) & Pakistan Institute of Engineering and Applied Science (PIEAS)."
            }
        ];
    }

    createSlider() {
        // Create slider container
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'olympiad-slider-container';
        
        // Create slider
        this.slider = document.createElement('div');
        this.slider.className = 'olympiad-slider';
        
        // Create slides
        this.olympiads.forEach((olympiad, index) => {
            const slide = document.createElement('div');
            slide.className = 'olympiad-slide';
            // Set background image explicitly with proper URL
            slide.style.backgroundImage = `url('${olympiad.image}')`;
            
            const content = document.createElement('div');
            content.className = 'olympiad-content';
            
            const title = document.createElement('h2');
            title.className = 'olympiad-title';
            title.textContent = olympiad.title;
            
            const description = document.createElement('div');
            description.className = 'olympiad-description';
            
            const typingText = document.createElement('span');
            typingText.className = 'typing-animation';
            typingText.textContent = "";
            this.descriptions.push(olympiad.description);
            
            description.appendChild(typingText);
            content.appendChild(title);
            content.appendChild(description);
            slide.appendChild(content);
            
            this.slider.appendChild(slide);
            this.slides.push(slide);

            // Log for debugging
            console.log(`Created slide for ${olympiad.title} with background image: ${olympiad.image}`);
        });
        
        // Create navigation dots
        const navigation = document.createElement('div');
        navigation.className = 'olympiad-navigation';
        
        this.olympiads.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'olympiad-dot';
            dot.dataset.slide = index;
            navigation.appendChild(dot);
        });
        
        // Create navigation arrows
        const prevArrow = document.createElement('div');
        prevArrow.className = 'olympiad-arrow prev';
        prevArrow.innerHTML = '&#10094;';
        prevArrow.addEventListener('click', () => this.prevSlide());
        
        const nextArrow = document.createElement('div');
        nextArrow.className = 'olympiad-arrow next';
        nextArrow.innerHTML = '&#10095;';
        nextArrow.addEventListener('click', () => this.nextSlide());
        
        this.sliderContainer.appendChild(this.slider);
        this.sliderContainer.appendChild(navigation);
        this.sliderContainer.appendChild(prevArrow);
        this.sliderContainer.appendChild(nextArrow);
        
        // Add to DOM
        const olympiadSection = document.getElementById('olympiads');
        if (olympiadSection) {
            const containerWrapper = olympiadSection.querySelector('.olympiad-container-wrapper');
            if (containerWrapper) {
                // Clear any existing content
                while (containerWrapper.lastChild) {
                    containerWrapper.removeChild(containerWrapper.lastChild);
                }
                containerWrapper.appendChild(this.sliderContainer);
            } else {
                // Fallback if the wrapper doesn't exist
                olympiadSection.appendChild(this.sliderContainer);
            }
        } else {
            // If olympiads section doesn't exist, create it
            const olympiadSection = document.createElement('section');
            olympiadSection.id = 'olympiads';
            olympiadSection.className = 'section-slide';
            
            const containerWrapper = document.createElement('div');
            containerWrapper.className = 'olympiad-container-wrapper';
            containerWrapper.appendChild(this.sliderContainer);
            olympiadSection.appendChild(containerWrapper);
            
            // Insert after programs section
            const programsSection = document.getElementById('programs');
            if (programsSection && programsSection.parentNode) {
                programsSection.parentNode.insertBefore(olympiadSection, programsSection.nextSibling);
            } else {
                document.body.appendChild(olympiadSection);
            }
        }

        // Immediately show the first slide
        this.goToSlide(0);
        
        // Start auto-play for the slideshow
        this.startAutoPlay();
    }

    setupNavigation() {
        const dots = document.querySelectorAll('.olympiad-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (this.currentSlide !== index && !this.isAnimating) {
                    this.goToSlide(index);
                }
            });
        });
    }

    setupEventListeners() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Add swipe navigation for touch devices
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                this.nextSlide();
            } else if (touchEndX - touchStartX > 50) {
                this.prevSlide();
            }
        });

        // Pause on hover
        this.sliderContainer.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.sliderContainer.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            if (this.typingComplete) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }

    goToSlide(index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update current slide
        this.currentSlide = index;
        
        // Update slider position
        this.slider.style.transform = `translateX(-${index * 100}%)`;
        
        // Update navigation dots
        const dots = document.querySelectorAll('.olympiad-dot');
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Add active class to current slide after a small delay
        setTimeout(() => {
            if (this.slides[index]) {
                this.slides[index].classList.add('active');
            }
        }, 100);
        
        // Start typing animation for the current slide
        this.stopTypingAnimation();
        this.startTypingAnimation(index);
        
        // Set transition end event
        const handleTransitionEnd = () => {
            this.isAnimating = false;
            this.slider.removeEventListener('transitionend', handleTransitionEnd);
        };
        
        this.slider.addEventListener('transitionend', handleTransitionEnd);
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.goToSlide(prevIndex);
    }

    startTypingAnimation(index) {
        const slide = this.slides[index];
        const typingElement = slide.querySelector('.typing-animation');
        const text = this.descriptions[index];
        
        if (!typingElement || !text) return;
        
        this.typingComplete = false;
        this.currentTypingSlide = index;
        typingElement.textContent = "";
        typingElement.style.width = "0";
        
        // Add a slight delay before starting typing to allow slide transition to complete
        setTimeout(() => {
            let i = 0;
            const typeChar = () => {
                if (index !== this.currentTypingSlide) return;
                
                if (i < text.length) {
                    typingElement.textContent += text.charAt(i);
                    // Gradually increase width
                    if (i < 10) {
                        typingElement.style.width = "10%";
                    } else if (i < 30) {
                        typingElement.style.width = "30%";
                    } else if (i < 60) {
                        typingElement.style.width = "50%";
                    } else if (i < 100) {
                        typingElement.style.width = "70%";
                    } else {
                        typingElement.style.width = "100%";
                    }
                    
                    i++;
                    this.typingTimeout = setTimeout(typeChar, this.typingSpeed);
                } else {
                    this.typingComplete = true;
                    // Make typing cursor disappear after typing is complete
                    setTimeout(() => {
                        typingElement.style.borderRight = "none";
                    }, 1000);
                    
                    // Start auto transition after typing is complete
                    if (!this.autoPlayInterval) {
                        this.startAutoPlay();
                    }
                }
            };
            
            // Start typing
            typeChar();
        }, 800); // Delay to allow slide transition to complete
    }

    stopTypingAnimation() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    }
}

// Initialize the olympiad slider after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const olympiadSlider = new OlympiadSlider();
});