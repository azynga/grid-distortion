const canvas = $('#main-canvas')[0];
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = 'hsl(210, 50%, 15%)';
const gridColor = 'hsl(210, 50%, 90%)';


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
        x: Math.cos(angle) * (multiplier * 1000000 / distance ** 2),
        y: Math.sin(angle) * (multiplier * 1000000 / distance ** 2)
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
        const isVertical = direction === 'vertical';
        const length = isVertical ? canvas.height : canvas.width;
        
        ctx.beginPath();
        
        for(let pixelNumber = 0; pixelNumber <= length; pixelNumber += pixelDistance) {
            
            const relativePosition = {
                x: isVertical ? position : pixelNumber,
                y: isVertical ? pixelNumber : position
            }
            
            const { shiftedX, shiftedY } = getShiftedPixel(relativePosition, attractor, multiplier)
            
            if(pixelNumber === 0) {
                ctx.moveTo(shiftedX, shiftedY);
            } else if (pixelNumber + pixelDistance > length) {
                const pixelsToEnd = length - pixelNumber;
                if(isVertical) {
                    ctx.lineTo(shiftedX, shiftedY + pixelsToEnd);
                } else {
                    ctx.lineTo(shiftedX + pixelsToEnd, shiftedY);
                }
            } else {
                ctx.lineTo(shiftedX, shiftedY);
            };
        };
        
        ctx.stroke();
        ctx.closePath();
    };
    
    for(let i = 0; i <= canvas.height; i += gridSize) {
        drawLine(canvas, 'horizontal', i, attractor, multiplier);
    };
    drawLine(canvas, 'horizontal', canvas.height, attractor, multiplier);

    for(let i = 0; i <= canvas.width; i += gridSize) {
        drawLine(canvas, 'vertical', i, attractor, multiplier);
    };
    drawLine(canvas, 'vertical', canvas.width, attractor, multiplier);
};


canvas.onmousemove = canvas.onmousedown = canvas.onmouseup = canvas.ontouchmove = canvas.ontouchstart = canvas.ontouchend = (event) => {
    window.requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const mousePosition = {
            x: event.pageX,
            y: event.pageY
        };
        
        const mousedown = event.buttons === 1;
        const multiplier = mousedown ? 10 : 1;
    
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        drawGrid(canvas, canvas.width / 40, 10, mousePosition, multiplier);
    
        ctx.fillStyle = canvas.style.backgroundColor;
        ctx.beginPath();
        ctx.arc(
            mousePosition.x,
            mousePosition.y,
            22,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(
            mousePosition.x,
            mousePosition.y,
            20,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.closePath();
    });
};