$('#color').change(function() {
    var h = $(this).val().toString().replace(/\W/, '').match(/.{2}/g);
    console.log(parseInt(h[0], 16), parseInt(h[1], 16), parseInt(h[2], 16))
});

var canvas_displace = document.getElementById('canvas_displace');
var canvas_albedo = document.getElementById('canvas_albedo');



$('.offcanvas-body').on('input', 'input', function() {

    permutation = $('#permutation').val();
    frequency = $('#frequency').val() / 200;
    octaves = $('#octaves').val();
    amplitude = $('#amplitude').val() / 10;
    persistence = $('#persistence').val() / 100;
    //A multiplier that determines how quickly the amplitudes diminish for each successive octave 
    scale = $('#scale').val() / 100;
    bias = $('#bias').val() / 100;
    seaLevel = $('#seaLevel').val() / 100;

    $('#valOfpermutation').html(permutation);
    $('#valOffrequency').html(frequency * 2);
    $('#valOfoctaves').html(octaves);
    $('#valOfamplitude').html(amplitude);
    $('#valOfpersistence').html(persistence);
    $('#valOfscale').html(scale);
    $('#valOfbias').html(bias);
    $('#valOfseaLevel').html($('#seaLevel').val() + '%');

});


function noise(seed) {

    frequency = $('#frequency').val() / 200;
    octaves = $('#octaves').val();
    amplitude = $('#amplitude').val() / 10;
    persistence = $('#persistence').val() / 100;
    scale = $('#scale').val() / 100;
    bias = $('#bias').val() / 100;
    seaLevel = $('#seaLevel').val() / 100;

    $('#valOffrequency').html(frequency * 2);
    $('#valOfoctaves').html(octaves);
    $('#valOfamplitude').html(amplitude);
    $('#valOfpersistence').html(persistence);
    $('#valOfseaLevel').html($('#seaLevel').val() + '%');

    var seaLevel = 0.5;
    var treelineFloor = seaLevel + 0.05;
    var treelineCeil = 0.78;
    /*
        frequency = 0.25;
        octaves = 8;
        amplitude = 0.8;
        persistence = 0.75;
    */

    vegfrequency = frequency;
    vegoctaves = octaves;
    vegamplitude = amplitude;
    vegpersistence = persistence - 0.01;


    var start = {
        "position": 0,
        "rgb": [0, 20, 70]
    };

    var mid = {
        "position": seaLevel,
        "rgb": [5, 70, 108]
    };

    var mid2 = {
        "position": seaLevel + 0.1,
        "rgb": [159, 152, 122]
    };

    var mid3 = {
        "position": seaLevel + 0.3,
        "rgb": [86, 57, 60]
    };

    var snowcap = {
        "position": seaLevel + .41,
        "rgb": [255, 255, 255]
    };

    var colors = [start, mid, mid2, mid3, snowcap];
    var simplex = new SimplexNoise(seed);

    var canvas_vegetation = document.getElementById('canvas_vegetation');
    var ctx_vegetation = canvas_vegetation.getContext('2d');
    ctx_vegetation.clearRect(0, 0, canvas_vegetation.width, canvas_vegetation.height);
    var veg_imageData = ctx_vegetation.getImageData(0, 0, canvas_vegetation.width, canvas_vegetation.height);
    var canvas_vegetationdata = veg_imageData.data;
    var vegsimplex = new SimplexNoise(seed);
    var nocanvas_vegetationoords = [];

    colors.map(function(x) {
        var hex = '#' + ((1 << 24) + (x.rgb[0] << 16) + (x.rgb[1] << 8) + (x.rgb[2])).toString(16);
    });

    const TWO_PI = 2 * Math.PI;

    var ctx_vegetation = canvas_vegetation.getContext('2d');
    ctx_vegetation.clearRect(0, 0, canvas_vegetation.width, canvas_vegetation.height);
    var imageData_vegetation = ctx_vegetation.getImageData(0, 0, canvas_vegetation.width, canvas_vegetation.height);
    var data_vegetation = imageData_vegetation.data;

    var ctx_displace = canvas_displace.getContext('2d');
    ctx_displace.clearRect(0, 0, canvas_displace.width, canvas_displace.height);
    var imageData_displace = ctx_displace.getImageData(0, 0, canvas_displace.width, canvas_displace.height);
    var data_displace = imageData_displace.data;

    var ctx_albedo = canvas_albedo.getContext('2d');
    ctx_albedo.clearRect(0, 0, canvas_albedo.width, canvas_albedo.height);
    var imageData_albedo = ctx_albedo.getImageData(0, 0, canvas_albedo.width, canvas_albedo.height);
    var data_albedo = imageData_albedo.data;

    var ctx_reflective = canvas_reflective.getContext('2d');
    ctx_reflective.clearRect(0, 0, canvas_reflective.width, canvas_reflective.height);
    var imageData_reflective = ctx_reflective.getImageData(0, 0, canvas_reflective.width, canvas_reflective.height);
    var data_reflective = imageData_reflective.data;

    var canvas_drawing = document.getElementById('canvas_drawing');
    var ctx_drawing = canvas_drawing.getContext('2d');
    ctx_drawing.clearRect(0, 0, canvas_drawing.width, canvas_drawing.height);
    var imageData_drawing = ctx_drawing.getImageData(0, 0, canvas_drawing.width, canvas_drawing.height);
    var data_drawing = imageData_drawing.data;


    for (let x = 0; x < canvas_displace.width; x++) {
        for (let y = 0; y < canvas_displace.height; y++) {
            let value = 0.0;
            for (let octave = 0; octave < octaves; octave++) {
                const freq = frequency * Math.pow(2, octave);
                const [nx, ny] = [x / canvas_displace.width, y / canvas_displace.height];
                const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
                const sinY = Math.sin(rdy + Math.PI);
                const a = TWO_PI * Math.sin(rdx) * sinY;
                const b = TWO_PI * Math.cos(rdx) * sinY;
                const d = TWO_PI * Math.cos(rdy);
                value += simplex.noise3D(a * freq, b * freq, d * freq) * (amplitude * Math.pow(persistence, octave));
            }
            var surfaceVal = value / (2 - 1 / Math.pow(2, octaves - 1));
            var pixPosition = (x + y * canvas_displace.width) * 4;
            var v = (surfaceVal * 128) + 128;

            //var halfCanv = data_albedo.height / 2;
            //var equatorialFalloff = ((halfCanv - Math.abs(y - (halfCanv))) / halfCanv) * v;


            if (v < 0) {
                v = 0;
            };

            var c = colorDelta(v / 255, colors);
            /*
            if (x == 300) {
                console.log(v / 255);
            }
            if (v > .949) {
                console.log(snowcap.position);
            }
            */

            if (v / 255 > .8) {
                var percent = v / 225;
                var colorArray = colors.sort((a, b) => a.position - b.position);

                var prevColor = colorArray[colorArray.filter(x => x.position <= percent).length - 1];
                var nextColor = colorArray[colorArray.filter(x => x.position <= percent).length];

                if (!nextColor) {
                    console.log();
                } else {

                    var normalizedNext = (nextColor.position - prevColor.position) * 100;
                    var normalizedPosition = (percent - prevColor.position) * 100;

                    var midPercentage = normalizedPosition / normalizedNext;


                    var RcolorDiff = (nextColor.rgb[0] - prevColor.rgb[0]) * midPercentage;
                    var newR = Math.round(prevColor.rgb[0] + RcolorDiff);

                    var GcolorDiff = (nextColor.rgb[1] - prevColor.rgb[1]) * midPercentage;
                    var newG = Math.round(prevColor.rgb[1] + GcolorDiff);

                    var BcolorDiff = (nextColor.rgb[2] - prevColor.rgb[2]) * midPercentage;
                    var newB = Math.round(prevColor.rgb[2] + BcolorDiff);

                    //console.log(newR, newG, newB);
                }
            }

            if (v / 255 < (seaLevel - 0.06)) {
                //data_vegetation[pixPosition + 0] = 0;
                //data_vegetation[pixPosition + 1] = 0;
                //data_vegetation[pixPosition + 2] = 0;
                //data_vegetation[pixPosition + 3] = 0;
            };

            if (v / 255 <= seaLevel) {
                v = seaLevel * 255;

            }


            //data_drawing[pixPosition + 0] = v;
            //data_drawing[pixPosition + 1] = v;
            //data_drawing[pixPosition + 2] = v;
            //data_drawing[pixPosition + 3] = 255;

            data_displace[pixPosition + 0] = v;
            data_displace[pixPosition + 1] = v;
            data_displace[pixPosition + 2] = v;
            data_displace[pixPosition + 3] = 255;

            data_albedo[pixPosition + 0] = c[0];
            data_albedo[pixPosition + 1] = c[1];
            data_albedo[pixPosition + 2] = c[2];
            data_albedo[pixPosition + 3] = 255;
            //console.log(data_vegetation[pixPosition + 3]);


            /*
            
                data_albedo[pixPosition + 0] = data_vegetation[pixPosition + 0];
                data_albedo[pixPosition + 1] = data_vegetation[pixPosition + 1];
                data_albedo[pixPosition + 2] = data_vegetation[pixPosition + 2];
                data_albedo[pixPosition + 3] = 255;

                data_albedo[pixPosition + 0] = c[0];
                data_albedo[pixPosition + 1] = c[1];
                data_albedo[pixPosition + 2] = c[2];
                data_albedo[pixPosition + 3] = 255;
                */

            data_reflective[pixPosition + 0] = 0;
            data_reflective[pixPosition + 1] = c[1];
            data_reflective[pixPosition + 2] = c[2];
            data_reflective[pixPosition + 3] = 255;



        }
    }

    var treeBottom = 255 * treelineFloor;
    var treeTop = 255 * treelineCeil;
    var treeRange = treeTop - treeBottom;

    for (let x = 0; x < canvas_vegetation.width; x++) {
        for (let y = 0; y < canvas_vegetation.height; y++) {
            let value = 0.0;
            for (let octave = 0; octave < vegoctaves; octave++) {
                const freq = vegfrequency * Math.pow(2, octave);
                const [nx, ny] = [x / canvas_vegetation.width, y / canvas_vegetation.height];
                const [rdx, rdy] = [nx * TWO_PI, ny * Math.PI];
                const sinY = Math.sin(rdy + Math.PI);
                const a = TWO_PI * Math.sin(rdx) * sinY;
                const b = TWO_PI * Math.cos(rdx) * sinY;
                const d = TWO_PI * Math.cos(rdy);
                value += vegsimplex.noise3D(a * freq, b * freq, d * freq) * (vegamplitude * Math.pow(vegpersistence, octave));
            }
            //field[x][y] = value / (2 - 1 / Math.pow(2, octaves - 1));
            var v = (value / (2 - 1 / Math.pow(2, vegoctaves - 1)) * 255) + 128;
            var xy = {};
            xy.x = x;
            xy.y = y;


            var halfCanv = canvas_vegetation.height / 2;

            var equatorialFalloff = ((halfCanv - Math.abs(y - (halfCanv))) / halfCanv) * v;
            var vegFalloff = Math.abs(y - halfCanv) / (halfCanv / 2);

            var bmpLvl = data_displace[(x + y * c.width) * 4 + 0];

            if (v / 255 <= treelineFloor || bmpLvl / 255 <= treelineFloor) {
                //v = seaLevel * 255;
                v = 0;
            };

            if (v / 255 >= treelineCeil || bmpLvl / 255 >= treelineCeil) {
                //v = seaLevel * 255;
                v = 0;
            };

            canvas_vegetationdata[(x + y * canvas_vegetation.width) * 4 + 0] = 0;
            canvas_vegetationdata[(x + y * canvas_vegetation.width) * 4 + 1] = equatorialFalloff;
            canvas_vegetationdata[(x + y * canvas_vegetation.width) * 4 + 2] = 0;
            canvas_vegetationdata[(x + y * canvas_vegetation.width) * 4 + 3] = v;
        }
    }



    var Composite = document.getElementById('composite');
    var ctxComposite = Composite.getContext('2d');
    //ctxComposite.fillStyle = "#a4caf0";
    //ctxComposite.fillRect(0, 0, Composite.width, Composite.height);

    ctx_albedo.putImageData(imageData_albedo, 0, 0);
    //ctx_albedo.globalCompositeOperation = 'source-atop';
    ctx_vegetation.putImageData(veg_imageData, 0, 0);

    //ctxComposite.drawImage(canvas_albedo, 0, 0);
    //ctxComposite.globalCompositeOperation = 'source-atop';
    //ctxComposite.drawImage(canvas_vegetation, 0, 0);

    ctx_displace.putImageData(imageData_displace, 0, 0);
    ctx_albedo.putImageData(imageData_albedo, 0, 0);
    ctx_reflective.putImageData(imageData_reflective, 0, 0);
    //ctx_vegetation.putImageData(imageData_vegetation, 0, 0);
    ctx_drawing.putImageData(imageData_drawing, 0, 0);


    $('#spinnerParent').addClass('d-none');
    var dataURL_displace = canvas_displace.toDataURL();
    var dataURL_albedo = canvas_albedo.toDataURL();
    var dataURL_reflective = canvas_reflective.toDataURL();
    var dataURL_vegetation = canvas_vegetation.toDataURL();
    var dataURL_drawing = canvas_drawing.toDataURL();

    var canvas_landscape = document.getElementById('canvas_landscape');
    var ctx_landscape = canvas_landscape.getContext("2d");

    //ctx_landscape.fillStyle = "#a4caf0";
    //ctx_landscape.fillRect(0, 0, 720, 480);
    ctx_landscape.drawImage(canvas_albedo, 0, 0);
    ctx_landscape.globalCompositeOperation = 'source-atop';
    ctx_landscape.drawImage(canvas_vegetation, 0, 0);
    //console.log(dataURL_vegetation)

    //ctx_landscape.globalCompositeOperation = 'source-over';
    //ctx_landscape.drawImage(canvas_vegetation, 0, 0);
    //ctx_albedo.globalCompositeOperation = "overlay";
    //ctx_albedo.drawImage(canvas_vegetation, 0, 0);
    //$('#spinnerParent').removeClass('d-none');
}



function colorDelta(percent, colorArray) {
    colorArray = colorArray.sort((a, b) => a.position - b.position);

    var prevColor = colorArray[colorArray.filter(x => x.position <= percent).length - 1];
    var nextColor = colorArray[colorArray.filter(x => x.position <= percent).length];


    if (!nextColor) {

        return [colorArray[colorArray.length - 1].rgb[0], colorArray[colorArray.length - 1].rgb[1], colorArray[colorArray.length - 1].rgb[2]];
    } else {

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
}