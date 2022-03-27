const canvas = $('#main-canvas')[0];
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gridColor = 'hsl(210, 50%, 90%)';

// ctx.fillStyle = drawColor;
// ctx.strokeStyle = drawColor;


const getRelationOfPoints = (origin, otherPoint) => {
    const positionDifference = {
        x: otherPoint.x - origin.x,
        y: otherPoint.y - origin.y
    };

    const distance = Math.sqrt(positionDifference.x ** 2 + positionDifference.y ** 2);
    const angle = Math.atan2(positionDifference.y, positionDifference.x);

    const relation = {
        distance: distance,
        angle: angle
    }
    return relation;
}

const getShiftedPixel = (origin, attractor, multiplier = 1) => {
    const { distance, angle } = getRelationOfPoints(origin, attractor);

    const shift = {
        x: Math.cos(angle) * (multiplier * 10000 / distance ** 2),
        y: Math.sin(angle) * (multiplier * 10000 / distance ** 2)
    };

    const shiftDistance = Math.sqrt(shift.x ** 2 + shift.y ** 2);

    if(shiftDistance > distance) {
        return origin;
    } else {
        const shiftedPixel = {
            shiftedX: origin.x + shift.x,
            shiftedY: origin.y + shift.y
        };
        return shiftedPixel;
    };
}


const drawGrid = (canvas, gridSize = 100, pixelDistance = 1, attractor, multiplier = 100) => {
    
    const drawLine = (canvas, direction, position, attractor, multiplier) => {

        const length = direction === 'vertical' ? canvas.height : canvas.width;
    
        for(let pixelNumber = 0; pixelNumber <= length; pixelNumber += pixelDistance) {

            const relativePosition = {
                x: direction === 'vertical' ? position : pixelNumber,
                y: direction === 'vertical' ? pixelNumber : position
            }
            
            const { shiftedX, shiftedY } = getShiftedPixel(relativePosition, attractor, multiplier)

            ctx.fillRect(
                shiftedX,
                shiftedY,
                2,
                2);
        };
    }
    
    for(let i = 0; i <= canvas.height; i += gridSize) {
        drawLine(canvas, 'horizontal', i, attractor, multiplier);
    };
    drawLine(canvas, 'horizontal', canvas.height, attractor, multiplier);
    
    for(let i = 0; i <= canvas.width; i += gridSize) {
        drawLine(canvas, 'vertical', i, attractor, multiplier);
    };
    drawLine(canvas, 'vertical', canvas.width, attractor, multiplier);

};

ctx.fillStyle = gridColor;
drawGrid(canvas, 60, 10, {x: 0, y: 0}, 0);


canvas.onmousemove = canvas.onmousedown = canvas.onmouseup = canvas.ontouchmove = canvas.ontouchstart = canvas.ontouchend = (event) => {
    window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const mousePosition = {
            x: event.offsetX,
            y: event.offsetY
        };
        
        
        const mousedown = event.buttons === 1;
        
        const multiplier = mousedown ? 1000 : 100;
    
        ctx.fillStyle = gridColor;
        drawGrid(canvas, 60, 10, mousePosition, multiplier);
    
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(
            mousePosition.x,
            mousePosition.y,
            20,
            0,
            2 * Math.PI
        );
        ctx.fill();
    });
};