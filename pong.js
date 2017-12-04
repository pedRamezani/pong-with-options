"use strict";
var options = {
radius: 5,
playerheight: 100,
comheight: 100,
paddlewidth: 5,
notrail: true,
rotate: false,
glitch: false,
winningscore: 500,
uicolor: 'white',
ballcolor: 'red',
twoplayer: false
}

var canvas = document.getElementById('cbox');
var ctx = canvas.getContext('2d');
var ballx = canvas.width/2;
var ballspeedx = 10;
var bally = canvas.height/2;
var ballspeedy = 6;
var playery = canvas.height/2 - options.playerheight/2;
var comy = canvas.height/2 - options.comheight/2;
var playerscore = 0;
var comscore = 0;
var showwin = false;

function optionchange() {
  options.notrail = document.getElementById('notrail').checked;
  options.rotate = document.getElementById('rotate').checked;
  options.glitch = document.getElementById('glitch').checked;
  options.twoplayer = document.getElementById('twoplayer').checked;
}

function clickme(evt) {
  if(showwin) {
    playerscore = 0;
    comscore = 0;
    showwin = false;
  }
}

//get the mousecords
function mousepos(evt) {
  var gamerec = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mousex = evt.clientX - gamerec.left - root.scrollLeft;
  var mousey = evt.clientY - gamerec.top - root.scrollTop;
  return {
    x: mousex,
    y: mousey
  };
}

//1. MAINFUNCTION: CALLS THE ENTIRE GAME
window.onload = function() {
  document.getElementById('notrail').checked = true;
  document.getElementById('rotate').checked = false;
  document.getElementById('glitch').checked = false;
  //setting the fps and calling the move and draw functions so often in a second
  game();

  canvas.addEventListener('mousedown',clickme)

  canvas.addEventListener('mousemove',
    function (evt) {
      var position = mousepos(evt);
      //colisionhandling for player
      if (position.y < options.playerheight/2 + 5) {playery = 5;}
      else if (position.y > canvas.height - options.playerheight/2 -5) {playery = canvas.height - options.playerheight -5;}
      //set playerpadlle position with the mousecords and center the paddle to the mousepos
      else {playery = position.y - options.playerheight/2;}
    } )


   // NEEDS TO BE FIXED
  window.addEventListener('keydown',
    function(evt) {
      var bob = evt.keyCode;
      if (evt.keyCode == 87) {
        evt.preventDefault();
        playery -= 12;
        if (playery < 5) {playery = 5;}
      }
      else if (evt.keyCode == 83) {
        evt.preventDefault();
        playery += 12;
        if (playery > canvas.height - options.playerheight -5) {playery = canvas.height - options.playerheight -5;}
      }
      if (evt.keyCode == 38) {
        evt.preventDefault();
        comy -= 120;
        if (comy < 5) {comy = 5;}
      }
      else if (evt.keyCode == 40) {
        evt.preventDefault();
        comy += 120;
        if (comy > canvas.height - options.comheight -5) {comy = canvas.height - options.comheight -5;}
        return false;
      }
    })

}

//3.
function resetball(currentx) {
  ballx = canvas.width/2;
  bally = canvas.height/2;
  ballspeedx *= -1;
  //If ball hits right wall +1 point for the player else for the computer (left wall)
  if (currentx > canvas.width/2) {playerscore++;}
  else {comscore++;}
  if (playerscore >= options.winningscore || comscore >= options.winningscore) {showwin = true;};

}

function game() {
  var fps = 30;
  setTimeout(
    function() {
      requestAnimationFrame(game);
      move();
      draw();
    },1000/fps);
}

//3. Called from move(): contolls the computerplayer and adjusts the center of its paddle to the bally position
function computermove() {
  if (bally < comy + options.comheight/2 - 20 ) {comy -= 8;}
  else if (bally > comy +options.comheight/2 + 20) {comy += 8;}
  //colisionhandling for com
  if (comy < 5) {comy = 5;}
  else if (comy > canvas.height - options.comheight -5) {comy = canvas.height - options.comheight -5;}

}

//2.
function move() {
  if (showwin) {return;}

  if (options.twoplayer == false) {computermove();}

  //if the ball hits the top or bottom wall it bounces off
  if (bally >= canvas.height - options.radius || bally <= 0 + options.radius) {
    ballspeedy *= -1;
  }

  //if the ball crosses the position where the paddle ends and the position of the ball is within the interval from the paddlestart to the paddleend the ball bounces off
  if (playery <= bally && playery + options.playerheight >= bally && ballx <= 5 + options.paddlewidth + options.radius) {
    ballspeedx *= -1;
    var dyp = bally - (playery + options.playerheight/2);
    ballspeedy = dyp * 0.25;
  }

  if (comy <= bally && comy + options.comheight >= bally && ballx >= canvas.width - 5 - options.paddlewidth - options.radius) {
    ballspeedx *= -1;
    var dyc = bally - (comy + options.comheight/2);
    ballspeedy = dyc * 0.25;
  }
  //if the ball hits the right or left ball hits the wall it resets and with the current location of the ball it can be determined wich player gets a point
  if (ballx <= 0 + options.radius || ballx >= canvas.width - options.radius) {resetball(ballx);}

  //changing the actual ballposition by adding the difference or speed to the current location
  ballx += ballspeedx;

  //changing the actual ballposition by adding the difference or speed to the current location
  bally += ballspeedy;
}

//2.
function draw() {

//Winscreen
if (showwin) {
    ctx.fillStyle ="black";
    ctx.fillRect(canvas.width/2-1,0,2,canvas.height);
    ctx.fillStyle = options.uicolor;
    ctx.textAlign = "center";
    if (playerscore >= options.winningscore) {ctx.fillText('LINKER SPIELER HAT GEWONNEN!', canvas.width/2, 50);}
    else if (comscore = options.winningscore) {ctx.fillText('RECHTER SPIELER HAT GEWONNEN!', canvas.width/2, 50);}
    ctx.fillText('Klicke um weiterzuspielen...', canvas.width/2, canvas.height - 50);
    return;
}

//1.background-color: if not set all objects will leave a trail
if (options.rotate) {
  //ctx.translate(canvas.width/2,canvas.height/2);
  ctx.rotate(1*Math.PI/180);
}

if (options.glitch) {
ctx.scale(0.99,0.99);
}

if (options.notrail) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = options.uicolor;
}

//DRAW a net
var i = 0;
for (;i < canvas.height; i += canvas.width/100) {
  ctx.fillRect(canvas.width/2 - 1,i,2,canvas.width/200);
}

//PADDLES: canvas.height/2 - 100 to center the bar (200 original lenght)
  ctx.shadowBlur=40;
  ctx.shadowOffsetX= 5;
  ctx.shadowOffsetY= 0;
  ctx.shadowColor= options.uicolor;
  ctx.fillRect(5,playery,options.paddlewidth,options.playerheight);
  ctx.shadowBlur=20;
  ctx.shadowOffsetX= -5;
  ctx.fillRect(canvas.width - 5 - options.paddlewidth,comy,options.paddlewidth,options.comheight)

//BALL
  ctx.beginPath();
  ctx.arc(ballx,bally,options.radius,0,Math.PI*2,true);
  ctx.shadowBlur=5;
  ctx.shadowOffsetX= - ballspeedx;
  ctx.shadowOffsetY= - ballspeedy
  ctx.shadowColor=options.ballcolor;
  ctx.fillStyle = options.ballcolor;
  ctx.fill();

//TEXT
  ctx.shadowColor = 'transparent';
  ctx.font = '30px Arial'
  ctx.fillStyle = options.uicolor;
  ctx.fillText(playerscore, 40, canvas.height - 10);
  ctx.fillText(comscore,canvas.width - 60, canvas.height - 10)
}


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
