const welcomeMessages = [
    "INITIALIZING FUNCTION GRAPHER...",
    "LOADING MATHEMATICAL MODULES...",
    "ESTABLISHING COORDINATE SYSTEM...",
    "READY FOR INPUT.",
    "", 
    "ENTER MATHEMATICAL FUNCTIONS TO VISUALIZE:",
    "• sin(x), cos(x), tan(x)",
    "• x^2, x² (both notations supported)",
    "• x³, sqrt(x), log(x)",
    "• pi, e constants supported",
    "", 
    "USE MOUSE/TOUCH TO INTERACT WITH GRAPH",
    "SCROLL/PINCH TO ZOOM",
    ""  
];

let messageIndex = 0;
let charIndex = 0;
let isTyping = true;
let currentContent = "";
let enterPressCount = 0;
let lastEnterTime = 0;
let skipIntro = false;

function skipToMain() {
    if (skipIntro) return;
    
    skipIntro = true;
    const terminalElement = document.getElementById('terminal-welcome');
    
    terminalElement.style.opacity = '0';
    terminalElement.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
        document.querySelector('.container').classList.add('show');
    }, 600);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && isTyping && !skipIntro) {
        const currentTime = Date.now();
        
        if (currentTime - lastEnterTime < 500) {
            enterPressCount++;
            if (enterPressCount >= 2) {
                skipToMain();
                return;
            }
        } else {
            enterPressCount = 1;
        }
        
        lastEnterTime = currentTime;
    }
});

function typeWriter() {
    if (skipIntro) return;
    
    const terminalElement = document.getElementById('terminal-welcome');

    if (messageIndex < welcomeMessages.length) {
        const currentMessage = welcomeMessages[messageIndex];

        if (charIndex < currentMessage.length) {
            currentContent = currentContent.replace('<span class="cursor"></span>', '');
            currentContent += currentMessage.charAt(charIndex) + '<span class="cursor"></span>';
            terminalElement.innerHTML = currentContent + '<div id="intro-footer" class="footer">[Double Press ENTER To Skip Intro]</div>';
            charIndex++;
            setTimeout(typeWriter, 50 + Math.random() * 50);
        } else {
            currentContent = currentContent.replace('<span class="cursor"></span>', '');
            currentContent += '<br><br>'; 
            terminalElement.innerHTML = currentContent + '<div id="intro-footer" class="footer">[Double Press ENTER To Skip Intro]</div>';
            messageIndex++;
            charIndex = 0;
            setTimeout(typeWriter, 200);
        }
    } else {
        terminalElement.innerHTML = currentContent + '<span class="cursor"></span><div id="intro-footer" class="footer">[Double Press ENTER To Skip Intro]</div>';
        isTyping = false;

        setTimeout(() => {
            if (!skipIntro) {
                terminalElement.style.opacity = '0';
                terminalElement.style.transition = 'opacity 1s ease-out';

                setTimeout(() => {
                    document.querySelector('.container').classList.add('show');
                }, 1200);
            }
        }, 2000);
    }
}

class FunctionGrapher {
    constructor() {
        this.canvas = document.getElementById('graph-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = document.getElementById('function-input');
        this.button = document.getElementById('graph-button');
        this.coordinates = document.getElementById('coordinates');

        this.scaleX = 40;
        this.scaleY = 40;
        this.originX = this.canvas.width / 2;
        this.originY = this.canvas.height / 2;

        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;

        this.setupEventListeners();
        this.setupCanvas();
        this.drawGrid();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.originX = rect.width / 2;
        this.originY = rect.height / 2;
        
        if (rect.width < 480) {
            this.scaleX = Math.max(20, rect.width / 15);
            this.scaleY = Math.max(20, rect.height / 12);
        } else if (rect.width < 768) {
            this.scaleX = Math.max(30, rect.width / 20);
            this.scaleY = Math.max(30, rect.height / 15);
        }
    }

    setupEventListeners() {
        this.button.addEventListener('click', () => this.graphFunction());

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.graphFunction();
            }
        });

        this.canvas.addEventListener('wheel', (e) => this.handleZoom(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());

        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        this.canvas.addEventListener('gesturestart', (e) => e.preventDefault());
        this.canvas.addEventListener('gesturechange', (e) => this.handlePinchZoom(e));
        this.canvas.addEventListener('gestureend', (e) => e.preventDefault());

        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.redraw();
        });
    }

    parseFunction(input) {
        let processed = input
            .replace(/²/g, '**2')
            .replace(/³/g, '**3')
            .replace(/⁴/g, '**4')
            .replace(/⁵/g, '**5')
            .replace(/⁶/g, '**6')
            .replace(/⁷/g, '**7')
            .replace(/⁸/g, '**8')
            .replace(/⁹/g, '**9')
            .replace(/¹/g, '**1')
            .replace(/⁰/g, '**0')
            .replace(/\^/g, '**')
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log')
            .replace(/ln/g, 'Math.log')
            .replace(/exp/g, 'Math.exp')
            .replace(/abs/g, 'Math.abs')
            .replace(/floor/g, 'Math.floor')
            .replace(/ceil/g, 'Math.ceil')
            .replace(/round/g, 'Math.round')
            .replace(/pi/g, 'Math.PI')
            .replace(/e(?![a-zA-Z])/g, 'Math.E')
            .replace(/asin/g, 'Math.asin')
            .replace(/acos/g, 'Math.acos')
            .replace(/atan/g, 'Math.atan');

        return new Function('x', `return ${processed}`);
    }

    drawGrid() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#003300';
        this.ctx.lineWidth = 0.5;

        const rect = this.canvas.getBoundingClientRect();
        const gridSpacing = 20;

        this.ctx.beginPath();
        for (let x = 0; x <= rect.width; x += gridSpacing) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, rect.height);
        }
        for (let y = 0; y <= rect.height; y += gridSpacing) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(rect.width, y);
        }
        this.ctx.stroke();

        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        this.ctx.moveTo(0, this.originY);
        this.ctx.lineTo(rect.width, this.originY);

        this.ctx.moveTo(this.originX, 0);
        this.ctx.lineTo(this.originX, rect.height);

        this.ctx.stroke();

        this.ctx.fillStyle = '#00aa00';
        this.ctx.font = '12px Fira Code';
        this.ctx.textAlign = 'center';

        const rect2 = this.canvas.getBoundingClientRect();

        for (let x = -this.originX; x < rect2.width - this.originX; x += this.scaleX) {
            if (x !== 0) {
                const screenX = x + this.originX;
                const value = (x / this.scaleX).toFixed(0);
                this.ctx.fillText(value, screenX, this.originY + 15);
            }
        }

        this.ctx.textAlign = 'left';
        for (let y = -this.originY; y < rect2.height - this.originY; y += this.scaleY) {
            if (y !== 0) {
                const screenY = this.originY - y;
                const value = (y / this.scaleY).toFixed(0);
                this.ctx.fillText(value, this.originX + 5, screenY + 4);
            }
        }
    }

    graphFunction() {
        const functionText = this.input.value.trim();
        if (!functionText) return;

        try {
            const func = this.parseFunction(functionText);
            this.drawGrid();
            this.plotFunction(func);
        } catch (error) {
            this.showError('Invalid function syntax');
        }
    }

    plotFunction(func) {
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#00ff00';
        this.ctx.shadowBlur = 5;

        this.ctx.beginPath();
        let firstPoint = true;

        const rect = this.canvas.getBoundingClientRect();

        for (let screenX = 0; screenX <= rect.width; screenX += 1) {
            const mathX = (screenX - this.originX) / this.scaleX;

            try {
                const mathY = func(mathX);

                if (isFinite(mathY)) {
                    const screenY = this.originY - (mathY * this.scaleY);

                    if (screenY >= -100 && screenY <= rect.height + 100) {
                        if (firstPoint) {
                            this.ctx.moveTo(screenX, screenY);
                            firstPoint = false;
                        } else {
                            this.ctx.lineTo(screenX, screenY);
                        }
                    } else {
                        firstPoint = true;
                    }
                } else {
                    firstPoint = true;
                }
            } catch (e) {
                firstPoint = true;
            }
        }

        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    handleZoom(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

        this.scaleX *= zoomFactor;
        this.scaleY *= zoomFactor;

        this.redraw();
    }

    handlePinchZoom(e) {
        e.preventDefault();
        
        const zoomFactor = Math.max(0.5, Math.min(2.0, e.scale));
        
        this.scaleX = Math.max(5, Math.min(200, this.scaleX * zoomFactor));
        this.scaleY = Math.max(5, Math.min(200, this.scaleY * zoomFactor));

        this.redraw();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (this.isDragging) {
            const deltaX = mouseX - this.lastX;
            const deltaY = mouseY - this.lastY;

            this.originX += deltaX;
            this.originY += deltaY;

            this.redraw();
        }

        this.updateCoordinates(mouseX, mouseY);
        this.lastX = mouseX;
        this.lastY = mouseY;
    }

    handleMouseDown(e) {
        this.isDragging = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.lastX = e.touches[0].clientX - rect.left;
            this.lastY = e.touches[0].clientY - rect.top;
            this.isDragging = true;
        } else if (e.touches.length === 2) {
            this.isDragging = false;
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            this.lastDistance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1 && this.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const touchY = e.touches[0].clientY - rect.top;

            const deltaX = touchX - this.lastX;
            const deltaY = touchY - this.lastY;

            this.originX += deltaX;
            this.originY += deltaY;

            this.redraw();
            this.updateCoordinates(touchX, touchY);

            this.lastX = touchX;
            this.lastY = touchY;
        } else if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            
            if (this.lastDistance) {
                const zoomFactor = distance / this.lastDistance;
                const clampedZoom = Math.max(0.8, Math.min(1.2, zoomFactor));
                
                this.scaleX = Math.max(5, Math.min(200, this.scaleX * clampedZoom));
                this.scaleY = Math.max(5, Math.min(200, this.scaleY * clampedZoom));
                
                this.redraw();
            }
            
            this.lastDistance = distance;
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.isDragging = false;
        this.lastDistance = null;
    }

    updateCoordinates(mouseX, mouseY) {
        const mathX = (mouseX - this.originX) / this.scaleX;
        const functionText = this.input.value.trim();

        if (functionText) {
            try {
                const func = this.parseFunction(functionText);
                const mathY = func(mathX);

                if (isFinite(mathY)) {
                    this.coordinates.textContent = `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`;
                    this.coordinates.style.display = 'block';
                } else {
                    this.coordinates.style.display = 'none';
                }
            } catch (e) {
                this.coordinates.style.display = 'none';
            }
        } else {
            this.coordinates.textContent = `(${mathX.toFixed(2)}, ${((this.originY - mouseY) / this.scaleY).toFixed(2)})`;
            this.coordinates.style.display = 'block';
        }
    }

    redraw() {
        const functionText = this.input.value.trim();
        if (functionText) {
            this.graphFunction();
        } else {
            this.drawGrid();
        }
    }

    showError(message) {
        this.coordinates.textContent = message;
        this.coordinates.style.display = 'block';
        this.coordinates.style.color = '#ff0000';

        setTimeout(() => {
            this.coordinates.style.color = '#00ff00';
            this.coordinates.style.display = 'none';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 500);

    const grapher = new FunctionGrapher();

    const examples = ['sin(x)', 'x²', 'cos(x)*sin(x)', 'x³-2*x', 'sqrt(abs(x))'];
    let exampleIndex = 0;

    setTimeout(() => {
        if (!grapher.input.value) {
            const demoFunction = examples[exampleIndex % examples.length];
            grapher.input.value = demoFunction;
            grapher.graphFunction();
            exampleIndex++;
        }
    }, 6000);
});
