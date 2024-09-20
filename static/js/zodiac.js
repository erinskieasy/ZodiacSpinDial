const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const zodiacSymbols = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍",
    Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
};

const svg = document.getElementById("zodiac-clock");
const svgNS = "http://www.w3.org/2000/svg";
const centerX = 200;
const centerY = 200;
const radius = 180;

function createZodiacClock() {
    const clockFace = document.createElementNS(svgNS, "circle");
    clockFace.setAttribute("cx", centerX);
    clockFace.setAttribute("cy", centerY);
    clockFace.setAttribute("r", radius);
    clockFace.setAttribute("fill", "#fff");
    clockFace.setAttribute("stroke", "#000");
    clockFace.setAttribute("stroke-width", "2");
    svg.appendChild(clockFace);

    const sliceGroup = document.createElementNS(svgNS, "g");
    sliceGroup.setAttribute("id", "zodiac-slices");
    svg.appendChild(sliceGroup);

    zodiacSigns.forEach((sign, index) => {
        const slice = createZodiacSlice(sign, index);
        sliceGroup.appendChild(slice);
    });

    addHighlightCircles();
}

function createZodiacSlice(sign, index) {
    const angle = (index * 30) - 90;
    const endAngle = angle + 30;
    const startX = centerX + radius * Math.cos(angle * Math.PI / 180);
    const startY = centerY + radius * Math.sin(angle * Math.PI / 180);
    const endX = centerX + radius * Math.cos(endAngle * Math.PI / 180);
    const endY = centerY + radius * Math.sin(endAngle * Math.PI / 180);

    const slice = document.createElementNS(svgNS, "g");
    slice.setAttribute("class", "zodiac-slice");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", `M${centerX},${centerY} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`);
    path.setAttribute("fill", `hsl(${index * 30}, 70%, 80%)`);
    path.setAttribute("stroke", "#000");
    path.setAttribute("stroke-width", "1");
    slice.appendChild(path);

    const textAngle = angle + 15;
    const textX = centerX + (radius * 0.7) * Math.cos(textAngle * Math.PI / 180);
    const textY = centerY + (radius * 0.7) * Math.sin(textAngle * Math.PI / 180);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", textX);
    text.setAttribute("y", textY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", "12");
    text.textContent = sign;
    slice.appendChild(text);

    const symbolX = centerX + (radius * 0.85) * Math.cos(textAngle * Math.PI / 180);
    const symbolY = centerY + (radius * 0.85) * Math.sin(textAngle * Math.PI / 180);

    const symbol = document.createElementNS(svgNS, "text");
    symbol.setAttribute("x", symbolX);
    symbol.setAttribute("y", symbolY);
    symbol.setAttribute("text-anchor", "middle");
    symbol.setAttribute("dominant-baseline", "middle");
    symbol.setAttribute("font-size", "20");
    symbol.textContent = zodiacSymbols[sign];
    slice.appendChild(symbol);

    return slice;
}

function addHighlightCircles() {
    const highlightPositions = [2, 4, 6, 8, 10];
    highlightPositions.forEach(position => {
        const angle = (position * 30) - 90;
        const x = centerX + (radius * 0.9) * Math.cos(angle * Math.PI / 180);
        const y = centerY + (radius * 0.9) * Math.sin(angle * Math.PI / 180);

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 15);
        circle.setAttribute("class", "highlight-circle");
        svg.appendChild(circle);
    });
}

function updateSoulmate() {
    const rotation = getCurrentRotation();
    const index = Math.round(rotation / 30) % 12;
    const soulmate = zodiacSigns[index];
    document.getElementById("soulmate-sign").textContent = soulmate;
}

function getCurrentRotation() {
    const slices = document.getElementById("zodiac-slices");
    const transform = slices.getAttribute("transform");
    if (transform) {
        const match = transform.match(/rotate\(([-\d.]+)/);
        return match ? parseFloat(match[1]) : 0;
    }
    return 0;
}

function snapToNearestSign(rotation) {
    return Math.round(rotation / 30) * 30;
}

createZodiacClock();
updateSoulmate();

let isDragging = false;
let startAngle = 0;
let currentRotation = 0;

function onMouseDown(event) {
    isDragging = true;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    startAngle = Math.atan2(event.clientY - rect.top - centerY, event.clientX - rect.left - centerX);
}

function onMouseMove(event) {
    if (!isDragging) return;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.atan2(event.clientY - rect.top - centerY, event.clientX - rect.left - centerX);
    const rotation = ((angle - startAngle) * 180 / Math.PI + currentRotation + 360) % 360;
    rotateZodiac(rotation);
}

function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    currentRotation = snapToNearestSign(getCurrentRotation());
    rotateZodiac(currentRotation);
    updateSoulmate();
}

function rotateZodiac(rotation) {
    const slices = document.getElementById("zodiac-slices");
    slices.style.transition = isDragging ? 'none' : 'transform 0.3s ease-out';
    slices.style.transform = `rotate(${rotation}deg)`;
}

svg.addEventListener("mousedown", onMouseDown);
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mouseup", onMouseUp);

// Touch events
svg.addEventListener("touchstart", (event) => {
    event.preventDefault();
    onMouseDown(event.touches[0]);
});

document.addEventListener("touchmove", (event) => {
    event.preventDefault();
    onMouseMove(event.touches[0]);
});

document.addEventListener("touchend", (event) => {
    event.preventDefault();
    onMouseUp();
});
