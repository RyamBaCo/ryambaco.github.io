window.requestAnimFrame = (function()
{
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(callback, element)
          {
              window.setTimeout(callback, 1000 / 60);
          };
})();

var context = $('#letterCanvas')[0].getContext('2d');
var canvasWidth = context.canvas.width;
var canvasHeight = context.canvas.height;
var ringImageHalfWidth = 0;
var ringImageHalfHeight = 0;

var SCALE = 30;
var bodies = null;
var ringIndizes = [];
var physicWorld = null;
var backImage = null;
var letterImage = null;
var numberOfRings = 0;

$(document).ready(function()
{
    bodies = new Array();
    ringIndizes = new Array();

    letterImage = new Image();
    letterImage.src = "letters.png";
    backImage = new Image();
    backImage.src = "back.jpg";
    ringImage = new Image();
    ringImage.src = "ring.png";

    ringImage.onload = function() 
    {
        ringImageHalfWidth = ringImage.width / 2;
        ringImageHalfHeight = ringImage.height / 2;
    }

    $.ajax(
    {
        url: "bodies.json", 
        dataType: 'json'
    }).done(function(data) 
    {
        initBodies(data);
    });
});
                    
function initBodies(jsonData) 
{ 
    for(var i in jsonData) 
        bodies[i] = Entity.build(i, jsonData[i]);
    
    physicWorld = new PhysicWorld(60, false, canvasWidth, canvasHeight, SCALE);
    physicWorld.setBodies(bodies);

    (function loop(animStart) 
    {
        update(animStart);
        draw();
        requestAnimFrame(loop);
    })();
}

function update(animStart) 
{
    physicWorld.update();
    physicWorld.updateBodies(bodies);
}

function draw() 
{
    context.drawImage(backImage, 0, 0);
    drawBlackSquares();
    for (var i in bodies) 
        bodies[i].draw(context);
}

// "fakes" transparency for rings
function drawBlackSquares()
{
    context.fillStyle = '#000000';

    if(numberOfRings == 1)
    {
        // left (aligned to ring)
        context.fillRect(0, bodies[0].y - ringImageHalfHeight, bodies[0].x - ringImageHalfWidth, ringImage.height);
        // right
        context.fillRect(bodies[0].x + ringImageHalfWidth, bodies[0].y - ringImageHalfHeight, canvasWidth - (bodies[0].x + ringImageHalfWidth), ringImage.height);
        // top (make rectangle 2 pixel larger in height because of float/int inaccuracy)
        context.fillRect(0, 0, canvasWidth, bodies[0].y - ringImageHalfHeight + 2);
        // bottom
        context.fillRect(0, bodies[0].y + ringImageHalfHeight - 2, canvasWidth, canvasHeight - (bodies[0].y + ringImageHalfHeight) + 2);
    }
}