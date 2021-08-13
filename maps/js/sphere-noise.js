var options = {
    amplitude: 1.0,
    frequency: .1,
    octaves: 7,
    persistence: 0.5
};



function makeSphereSurface(canvasElement, options, seed, bottomClip) {
    const TWO_PI = 2 * Math.PI;
    var simplex = new SimplexNoise(seed);
    var ctx = canvasElement.getContext('2d');

    var imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var data = imageData.data;

    const { amplitude, frequency, octaves, persistence } = options;
    const field = new Array(canvasElement.width);
    for (let x = 0; x < canvasElement.width; x++) {
        field[x] = new Array(canvasElement.height);
        for (let y = 0; y < canvasElement.height; y++) {
            let value = 0.0;

            for (let octave = 0; octave < octaves; octave++) {
                const freq = frequency * Math.pow(2, octave);
                const [nx, ny] = [x / canvasElement.width, y / canvasElement.height];
                const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
                const sinY = Math.sin(rdy + Math.PI);
                const a = TWO_PI * Math.sin(rdx) * sinY;
                const b = TWO_PI * Math.cos(rdx) * sinY;
                const d = TWO_PI * Math.cos(rdy);
                value += simplex.noise3D(a * freq, b * freq, d * freq) *
                    (amplitude * Math.pow(persistence, octave));
            }
            var v = (value / (2 - 1 / Math.pow(2, octaves - 1)) * 128) + 128;

            var pixPosition = (x + y * canvasElement.width) * 4;
            data[pixPosition + 0] = v;
            data[pixPosition + 1] = v;
            data[pixPosition + 2] = v;
            data[pixPosition + 3] = 255;

        }
    }

    ctx.putImageData(imageData, 0, 0);
}


function colorDelta(percent, colorArray) {
    colorArray = colorArray.sort((a, b) => a.position - b.position);

    var prevColor = colorArray[colorArray.filter(x => x.position <= percent).length - 1];
    var nextColor = colorArray[colorArray.filter(x => x.position <= percent).length];

    if (!nextColor) {
        nextColor = colorArray[colorArray.length - 1];
    }

    var btwn = (percent - prevColor.position) / (nextColor.position - prevColor.position);


    var normalizedNext = (nextColor.position - prevColor.position) * 100;
    var normalizedPosition = (percent - prevColor.position) * 100;

    var midPercentage = normalizedPosition / normalizedNext;


    var RcolorDiff = (nextColor.rgb[0] - prevColor.rgb[0]) * midPercentage;
    var newR = Math.round(prevColor.rgb[0] + RcolorDiff);

    var GcolorDiff = (nextColor.rgb[1] - prevColor.rgb[1]) * midPercentage;
    var newG = Math.round(prevColor.rgb[1] + GcolorDiff);

    var BcolorDiff = (nextColor.rgb[2] - prevColor.rgb[2]) * midPercentage;
    var newB = Math.round(prevColor.rgb[2] + BcolorDiff);

    if (isNaN(newR)) {
        newR = colorArray[colorArray.length - 1].rgb[0];
    }

    if (isNaN(newG)) {
        newG = colorArray[colorArray.length - 1].rgb[1];
    }

    if (isNaN(newB)) {
        newB = colorArray[colorArray.length - 1].rgb[2];
    }
    return [newR, newG, newB];
}