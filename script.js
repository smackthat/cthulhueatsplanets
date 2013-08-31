var Planets = [];
var Particles = [];


//The scrolling background...

var scrollSpeed = 20; 
var step = 1; 				
var current = 0;			
var imageWidth = 1000;		
var restartWidth = 359;


var restartPosition = -(imageWidth - restartWidth);
function scrollBg(){
	current -= step;
	if (current == restartPosition) {current = 0;}   
	$('#background').css("background-position",current+"px 0");
	};
			
setInterval("scrollBg()", scrollSpeed);

/***************************************************************************/
//Let's make the canvas ready...
$(document).ready(function() {

    var canvas = document.getElementById('background');
    var ctx = canvas.getContext("2d");
    window.addEventListener("keydown",doKeyDown, true);
    var playerX = 50;
    var playerY = 200;
    
    
    
    //Let's import the Cthulhu sprite
    var cthulhu = new Image();
    cthulhu.src = 'http://i1287.photobucket.com/albums/a632/MrDeltoid/pruitpruit_zpsc847d437.png';
    
    function init() {
        playerX = 50;
        playerY = 200;
        score = 0;
    }
    
    function Planet(posX, posY, color1, color2) {
        this.posX = posX;
        this.posY = posY;
        this.radius = 100;
        this.color1 = color1;
        this.color2 = color2;
    
        this.move = function() {
            this.posX -= 1;
            posX = this.posX;
        };
        
    
        this.draw = function() {
        ctx.beginPath();
        ctx.arc(posX, posY, 50, 0, Math.PI*2);
        ctx.fillStyle = makeGradient(posX,posY,color1,color2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        
        };
    };
    
    //The explosion particles
    
    function Particle(x,y) {
        this.x = x;
        this.y = y;
        this.radius = 30;
        this.color;
        this.scale = 1.0;
        this.scaleSpd = 0.5;
        this.velocityX = 0;
        this.velocityY = 0;
        
        this.update = function(ms) {
            
            this.scale -= this.scaleSpd * ms / 1000.0;
            
            if (this.scale <= 0) {	
                this.scale = 0;
                scale = 0;
                
                
            }
			this.x += this.velocityX * ms/1000.0;
			this.y += this.velocityY * ms/1000.0;
        };
        
        
        this.draw = function(ctx)
		{
			// translating the 2D context to the particle coordinates
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.scale(this.scale, this.scale);
			
			// drawing a filled circle in the particle's local space
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
			ctx.closePath();
			
			ctx.fillStyle = this.color;
			ctx.fill();
			
			ctx.restore();
		};
    };
    
    function explosion(deadPlanet) {
        
        var posX = deadPlanet.posX;
        var posY = deadPlanet.posY;
        var color1 = deadPlanet.color1;
        var color2 = deadPlanet.color2;
        var count = 10;
        var minSpeed = 60.0;
	    var maxSpeed = 250.0;
	    var minScaleSpeed = 1.0;
	    var maxScaleSpeed = 3.0;
	    var minRadius = 15;
	    var maxRadius = 35;
	    
	    for (var angle=0; angle < 360; angle += Math.round(360/count)) {
	        var colorRandomizer = Math.floor(Math.random()*2);
	        var particle = new Particle(posX,posY);
	        if (colorRandomizer === 1) {
	            particle.color = color1;
	        }
	        else {
	            particle.color = color2;
	        }
	        particle.scaleSpd = randomFloat(minScaleSpeed, maxScaleSpeed);
	        particle.radius = randomFloat(minRadius, maxRadius);
	        
	        var speed = randomFloat(minSpeed, maxSpeed);
	        
	        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		    particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
		    
		    Particles.push(particle);
	        
	    }
        
        
    }; 
    
    function randomFloat (min, max) {
	
	    return min + Math.random()*(max-min);
    };

    function drawPlayer() {
        ctx.drawImage(cthulhu, playerX, playerY,80,80);
    };

    function makeGradient(posX, posY, color1, color2) {
        var grd = ctx.createLinearGradient(posX-50,posY-50,posX+50,posY+50);
        grd.addColorStop(0, color1);
        grd.addColorStop(1, color2);
        return grd;
    };

    function generateColor() {
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    };

    function generatePlanet() {
        var x = 1050;
        var y = Math.floor(50 + Math.random()*500);
        var color1 = generateColor();
        var color2 = generateColor();
        var pla = new Planet(x,y,color1,color2);
        pla.draw();
        Planets.push(pla);
        
    };
    
    function isCollision(i) {
        return playerX + 80 > Planets[i].posX && Planets[i].posX + 100 > playerX &&
                   playerY + 80 > Planets[i].posY && Planets[i].posY + 100 > playerY;
    };
    
    function Score() {
        var score = document.getElementById('score');
        this.points = 0;
        
        this.add = function(points) {
            this.points += points;
            this.update();
        };
        
        this.update = function() {
            score.textContent = "Score: " + this.points;
        };
    };
    
    var totalScore = new Score();
    
  
    
    function clearBg() {
        canvas.width = canvas.width;
    };
    
    
    function doKeyDown(e) {
        if (e.keyCode === 87 || e.keyCode === 38) {
            if (playerY < 0 ) {
                playerY = playerY;
            }
            else {
            playerY = playerY - 5;
            drawPlayer();
            }
        }
        if (e.keyCode === 83 || e.keyCode === 40) {
            if (playerY > 520) {
                playerY = playerY;
            }
            else {
            playerY = playerY + 5;
            drawPlayer();
            }
        }
        if (e.keyCode === 75) {
            alert("Particle 1 radius: " + Particles[0].radius);
        }
        if (e.keyCode === 76) {
            alert("Current particles: " + Particles.length);
        }
        if (e.keyCode === 73) {
            alert("Score: " + Score.points);
        }
    };
    
    //The main game loop,responsible for array iterations 'n stuff :)
    
    function gameLoop() {
            clearBg();
            drawPlayer();
        for (var i = 0; i < Planets.length; i++) {
            if (Planets[i].posX < -500) {
                Planets.splice(i,1);
            }
                else {
            Planets[i].draw();
            Planets[i].move();
                }
            if (isCollision(i)) {
                explosion(Planets[i]);
                Planets.splice(i,1);
                totalScore.add(10);
            }
        
        }
        if (Particles.length === 50) {
            Particles.splice(0,40);
        }
        for (var i= 0; i < Particles.length; i++) {
            var currentParticle = Particles[i];
            currentParticle.update(10);
            currentParticle.draw(ctx);
        }
        
        
    };
    
    

    setInterval(gameLoop,10);
    setInterval(generatePlanet, 6000);

});

