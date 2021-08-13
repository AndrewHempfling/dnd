function noiseCanvas(canvasElement, randomSeed, zoomLevel, octaves) {

    var simplex = new SimplexNoise(randomSeed);
    var ctx = canvasElement.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var data = imageData.data;

    var zoom = zoomLevel;
    var l = 1;
    var o = 0.5;

    //first pass
    //((x1+y1)/2)/zoom
    for (var x1 = 0; x1 < canvasElement.width; x1++) {
        for (var y1 = 0; y1 < canvasElement.height; y1++) {

            //var v1 = (simplex.noise2D(x1 / zoom, y1 / zoom) * l) * 255;
            // * (255 / 2)
            var v1 = (simplex.noise3D(x1 / zoom, y1 / zoom, ((x1 + y1) / 2) / zoom) * (255 * o)) + (255 * o);

            data[(x1 + y1 * canvasElement.width) * 4 + 0] = v1;
            data[(x1 + y1 * canvasElement.width) * 4 + 1] = v1;
            data[(x1 + y1 * canvasElement.width) * 4 + 2] = v1;
            data[(x1 + y1 * canvasElement.width) * 4 + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    var imageDataFractal = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var dataFractal = imageDataFractal.data;
    var z = zoom;

    for (i = 0; i < octaves; i++) {
        z *= o;
        l *= o;
        z = z.toFixed(4);

        for (var x = 0; x < canvasElement.width; x++) {
            for (var y = 0; y < canvasElement.height; y++) {
                //var v = (simplex.noise2D(x / z, y / z) * (l / o)) * (255 / 2);
                var v = (simplex.noise3D(x / z, y / z, ((x + y) / 2) / z) * (255 * o));

                var r = dataFractal[(x + y * canvasElement.width) * 4 + 0];
                var g = dataFractal[(x + y * canvasElement.width) * 4 + 1];
                var b = dataFractal[(x + y * canvasElement.width) * 4 + 2];


                dataFractal[(x + y * canvasElement.width) * 4 + 0] = r + v;
                dataFractal[(x + y * canvasElement.width) * 4 + 1] = g + v;
                dataFractal[(x + y * canvasElement.width) * 4 + 2] = b + v;
                dataFractal[(x + y * canvasElement.width) * 4 + 3] = 255;
            }
        }
        ctx.putImageData(imageDataFractal, 0, 0);
    }
}





var options = {
    amplitude: 1.0,
    frequency: .1,
    octaves: 7,
    persistence: 0.5
};
const TWO_PI = 2 * Math.PI;
var circumference = 720;
var simplex = new SimplexNoise();
var a = [];



makeSphereSurface(document.getElementById('drawing'), circumference, options)

function makeSphereSurface(canvasElement, circumference, options) {
    var ctx = canvasElement.getContext('2d');

    var imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    var data = imageData.data;
    var b = [];

    const { amplitude, frequency, octaves, persistence } = options;
    const field = new Array(circumference);
    for (let x = 0; x < circumference; x++) {
        field[x] = new Array(circumference);
        for (let y = 0; y < circumference; y++) {
            let value = 0.0;

            for (let octave = 0; octave < octaves; octave++) {
                const freq = frequency * Math.pow(2, octave);
                const [nx, ny] = [x / circumference, y / circumference];
                const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
                const sinY = Math.sin(rdy + Math.PI);
                const a = TWO_PI * Math.sin(rdx) * sinY;
                const b = TWO_PI * Math.cos(rdx) * sinY;
                const d = TWO_PI * Math.cos(rdy);
                value += simplex.noise3D(a * freq, b * freq, d * freq) *
                    (amplitude * Math.pow(persistence, octave));
            }
            var v = (value / (2 - 1 / Math.pow(2, octaves - 1)) * 128) + 128;
            //var rgba = {};
            //rgba.r = v;
            //rgba.g = v;
            //rgba.b = v;
            //rgba.a = 255;

            //field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
            //field[x][y] = rgba;

            data[(x + y * canvasElement.width) * 4 + 0] = v;
            data[(x + y * canvasElement.width) * 4 + 1] = v;
            data[(x + y * canvasElement.width) * 4 + 2] = v;
            data[(x + y * canvasElement.width) * 4 + 3] = 255;

        }
    }
    //data.map(x => x = Math.random() * 100)
    ctx.putImageData(imageData, 0, 0);


    //return field;
}





/*
amplitude?: number – Defaults to 1.0
frequency?: number – Defaults to 1.0
octaves?: number – Defaults to 1
persistence?: number – Defaults to 0.5

// This is free and unencumbered software released into the public domain
const TWO_PI = 2 * Math.PI;
function processOptions(options) {
    return {
        amplitude: typeof options.amplitude === "number" ? options.amplitude : 1.0,
        frequency: typeof options.frequency === "number" ? options.frequency : 1.0,
        octaves: typeof options.octaves === "number"
            ? Math.floor(options.octaves)
            : 1,
        persistence: typeof options.persistence === "number"
            ? options.persistence
            : 0.5,
    };
}
export function makeSphereSurface(circumference, noise3, options = {}) {
    const { amplitude, frequency, octaves, persistence } = processOptions(options);
    const field = new Array(circumference);
    for (let x = 0; x < circumference; x++) {
        field[x] = new Array(circumference);
        for (let y = 0; y < circumference; y++) {
            let value = 0.0;
            for (let octave = 0; octave < octaves; octave++) {
                const freq = frequency * Math.pow(2, octave);
                const [nx, ny] = [x / circumference, y / circumference];
                const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
                const sinY = Math.sin(rdy + Math.PI);
                const a = TWO_PI * Math.sin(rdx) * sinY;
                const b = TWO_PI * Math.cos(rdx) * sinY;
                const d = TWO_PI * Math.cos(rdy);
                value += noise3(a * freq, b * freq, d * freq) *
                    (amplitude * Math.pow(persistence, octave));
            }
            field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
        }
    }
    return field;
}



*/