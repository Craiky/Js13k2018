var canvas = document.getElementById("game")
var ctx = canvas.getContext("2d")

var grid = [];
var w = 10;
var rows = 80;
var cols= 60;

var rooms = [];
var collide = false;

var amount = 4;
var size = 10;			//the actuall size will be a number bettween 5 and 20 | e.g: size+sizeMin
var sizeMin = 10;

var disX;
var disY;
var corridorW = 1;

var hero;
var enemys = []

var zoom = 4;

var step = [0,1,0]

var arr = [];

var space=u=d=l=r=0;

var startingAmount = 6

var coolDown = false;

var interval = [];

var win = false //win
var lose = false //lose
var wCS = false //win cut scene
var sCS = false //start cut scene
var tut = false //tutorial
var tutA = false //already done tutorial
var menuOn = true //menuOn

var beacons = [];
var beaconSpots = [];
var switched = 0

var level = 1;

var time = 90;
var timeR = 90

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

function Cell(c, r, x, y)
	{
		this.c = c	//colum it is in
		this.r = r	//row it is in
		this.x = x
		this.y = y
		this.type = 0;
		this.dir;
		
		this.show = function() 
			{
		  	if(this.type == 0)
		  		{
						ctx.fillStyle = "#292634"
						ctx.fillRect(this.x, this.y, w, w)
		  		}
		  		
		  	else if(this.type == 1)
		  		{
		  			ctx.fillStyle = "#489551"
		  			ctx.fillRect(this.x, this.y, w, w)
		  		}		
		  			
		  	else if(this.type == 2) 
		  		{
		  			ctx.fillStyle = "#AA856F"
		  			ctx.fillRect(this.x, this.y, w, w)
		  			
		  			for(var i = 1; i < 3; i++) 
		  				{
		  					ctx.fillStyle = "#874A24"
		  					ctx.fillRect(this.x, this.y+((w/3)*i), w, 1);
		  				}
		  		}
		  		
		  	else if(this.type == 3)
		  		{
		  			ctx.fillStyle = "#AA856F"
		  			ctx.fillRect(this.x, this.y, w, w)
		  			
		  			for(var i = 1; i < 3; i++) 
		  				{
		  					ctx.fillStyle = "#874A24"
		  					ctx.fillRect(this.x+((w/3)*i), this.y, 1, w);
		  				}
		  		}
		  	else if(this.type == 4) 
		  		{
		  			ctx.fillStyle = "#2EC0F9"
		  			ctx.fillRect(this.x, this.y, w, w)
		  		}
		  		
		  	else if(this.type == 5)
		  		{
		  			ctx.fillStyle = "#8D6A9F"
		  			ctx.fillRect(this.x, this.y, w, w)
		  		}
		  		
		  	else if(this.type == 6)
		  		{
						var my_gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y+w*3);
						my_gradient.addColorStop(0, "#57719C");
						my_gradient.addColorStop(1, "#292634");
						ctx.fillStyle = my_gradient;
		  			ctx.fillRect(this.x, this.y, w, w)
		  		}
		  		
		  	else if(this.type == 7)
		  		{
		  			ctx.fillStyle = my_gradient;
		  			ctx.fillRect(this.x, this.y, w, w)
		  		}
		  }
		
		this.detect = function()
			{
				var n = []
			
				n[0] = grid[index(c-1, r )]; // top
				n[1] = grid[index(c, r+1)]; //right
				n[2] = grid[index(c, r-1)]; //left
			
				n[3] = grid[index(c+1, r)]; //bottom
				n[4] = grid[index(c+2, r)]; //bottom's bottom
				
				for(var i = 0; i < 4; i++) 
					{	
						if(n[i] && this.type == 1)
							{
								if(n[i].type == 0 || n[i].type == 7 || n[i].type == 6)
									{
										this.line(i)
										this.type = 1
									}
							}
					}
					
				if(n[3] && n[3].type == 0)
					{
						if(this.type == 1 || this.type == 8)
							{
								n[3].type = 6;
							}
					}
						
				if(n[3] && n[3].type == 0 && this.type == 6)
					{
						n[3].type = 7;
					}
					
				if(n[4] && n[4].type == 0 && this.type == 6)
					{
						n[4].type = 7
					}		
			}
			
		this.carve = function()
			{
				for (var i = 0; i < rooms.length; i++) 
					{
						if(this.c >= rooms[i].y/w && this.c < rooms[i].y/w+rooms[i].h/w && this.r >= rooms[i].x/w && this.r < rooms[i].x/w+rooms[i].w/w)
							{
								this.type = 1
							}
					}
			}
			
		this.carveH = function(dis,x,y)
			{
				if(this.r >= x && this.r < x+dis && this.c < y+corridorW && this.c > y-corridorW)
					{
						this.type = 3
					}
			}
			
		this.carveV = function(dis,x,y)
			{
				if(this.c >= y && this.c < y+dis && this.r < x+corridorW && this.r > x-corridorW)
					{
						this.type = 2
					}
			}
		this.line = function(dir)
			{
				
				var t = [ 
									[0,0,w,3],
									[w-3,0,3,w],
									[0,0,3,w],
									[0,w,w,3]
								]
				
				for(var i = 0; i < 4; i++) 
					{
						if(dir == i)
							{
								ctx.fillStyle = "#6FAE53"
								ctx.fillRect(this.x+t[i][0],this.y+t[i][1],t[i][2],t[i][3])
							}
					}
			}
		
		this.collide = function() 
			{
				if(hero.x >= this.x && hero.x+7 <= this.x+w && hero.y+8 >= this.y && hero.y+8 <= this.y+w)
					{
						if(this.type == 0 || this.type == 7 || this.type == 6)
							{	
								zoom = 7
							}
					}
				if(hero.x+7 >= this.x && hero.x <= this.x+w && hero.y+8 >= this.y && hero.y <= this.y+w && this.type == 5)
					{
						this.type = 4;
					}
			}
			
		this.beacon = function()
			{
				for(var i = 0; i < beacons.length; i++) 
					{
						if(this.x == grid[beacons[i]].x && this.y == grid[beacons[i]].y)
							{
								this.type = 5
							}
					}
			}
	}
  
function makeGrid()
 	{ 
  	for (var r = 0; r < rows; r++) 
  		{
    		for (var c = 0; c < cols; c++) 
    			{
    				var y = c*w
    				var x = r*w
     				var cell = new Cell(c, r, x, y);
      			grid.push(cell);
    			}
  		}
 	}
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
 	
function Room(x, y, width, height, e)
	{
		this.x = (x-1)*w;
		this.y = (y-1)*w;
		this.w = width*w;
		this.h = height*w;
		
		this.center = [Math.floor(this.x/w+width/2), Math.floor(this.y/w+height/2)]
		
		this.enemys = function()
			{
				for(var i = 0; i < enemys.length; i++) 
					{
						if(enemys[i].x+7 > this.x && enemys[i].x < this.x+this.w && enemys[i].y+10 > this.y && enemys[i].y < this.y+this.h)
							{
								enemys[i].bX = this.x
								enemys[i].bY = this.y
								enemys[i].bW = this.w
								enemys[i].bH = this.h
							}
					}
			}	
		this.beacons = function()
			{
				var test = []
				
				for(var i = 0; i < grid.length; i++)
					{
						if(grid[i].type == 1 && grid[i].x+w > this.x+w && grid[i].x < this.x+this.w-w && grid[i].y+w > this.y+w && grid[i].y < this.y+this.h-w)
							{
								test.push(i)
							}
					}
				
				beaconSpots.push(test)
			}
	}

function createRooms(number) 
	{
		for (var i = 0; i < number; i++) 
			{
				var room = new Room(Math.floor(Math.random()*rows)+1, Math.floor(Math.random()*cols)+1, Math.floor(Math.random()*size)+sizeMin, Math.floor(Math.random()*size)+sizeMin, i)
					
				if(i > 0)
					{
						if(rooms[0].x+rooms[0].w >= rows*w || rooms[0].x <= 0 || rooms[0].y+rooms[0].h >= cols*w || rooms[0].y <= 0)
							{
								rooms = []
								createRooms(number);
								break;
							}
							
						for (var e = 0; e < rooms.length; e++) 
							{
								collide = false

								if(room.x <= rooms[e].x+rooms[e].w && room.x+room.w >= rooms[e].x && room.y <= rooms[e].y+rooms[e].h && room.y+room.h >= rooms[e].y)
									{
										collide = true;
										i--
										break;
									}
								else if (room.x+room.w >= rows*w || room.x <= 0 || room.y+room.h >= cols*w || room.y <= 0) 
									{
										collide = true;
										i--;
										break;
									}
							}
					}
				
				if(collide == false)
					{
						rooms.push(room) 
						
						if(i>0)
							{
								hCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
								vCorridor(rooms[i-1].center[0], room.center[0], rooms[i-1].center[1], room.center[1])
							}
					}
			}
	}
	
function hCorridor(x1,x2,y1,y2)
	{
		if(x1 > x2)
			{
				disX = x1-x2
				disX += 1
				
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x2, y2)
					}				
			}
		else// if(x2 < x1) 
			{
				disX = x2 - x1
				disX += 1
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveH(disX, x1, y1)
					}
			}
			
	}
	
function vCorridor(x1,x2,y1,y2)
	{
		var x;
		
		if(y1 > y2)
			{
				disY = y1-y2
				disY += 1
				
				if(x2+(disX-1) > x1+(disX-1))
					{
						x = x2
					}
				else 
					{
					x = x2+(disX-1)
					}
																															
				for(var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y2)
					}
			}
		else// if(y2 > y1) 
			{
				disY = y2 - y1
				disY += 1
				
				if(x1+(disX-1) > x2+(disX-1))
					{
						x = x1
					}	
				else 
					{
						x = x1+(disX-1)
					}
					
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].carveV(disY, x, y1)
					}
				
			}
			
	}
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


function heroClass()
	{
		this.x
		this.y
		
		this.draw = function()
			{
						ctx.fillStyle = "white"
						ctx.fillRect(this.x,this.y,7,7)
						
						ctx.fillStyle = "#dcd9d9"
						ctx.fillRect(this.x+1,this.y+7, 2,step[0])
						ctx.fillRect(this.x+4,this.y+7, 2,step[1])		
				
						if(u)
							{
							}
						else if(d)
							{
								ctx.fillStyle = "black"
								ctx.fillRect(this.x+2,this.y+2, 1,1)
								ctx.fillRect(this.x+4,this.y+2, 1,1)		
							}
						else if(l)
							{
								ctx.fillStyle = "black"
								ctx.fillRect(this.x+1,this.y+2, 1,1)
								ctx.fillRect(this.x+3,this.y+2, 1,1)
							}
						else if(r)
							{
								ctx.fillStyle = "black"
								ctx.fillRect(this.x+3,this.y+2, 1,1)
								ctx.fillRect(this.x+5,this.y+2, 1,1)
							}
					
						else
							{
								ctx.fillStyle = "black"
								ctx.fillRect(this.x+2,this.y+2, 1,1)
								ctx.fillRect(this.x+4,this.y+2, 1,1)
								ctx.fillStyle = "#dcd9d9"
								ctx.fillRect(this.x+1,this.y+7, 2,1)
								ctx.fillRect(this.x+4,this.y+7, 2,1)	
							}
			}
		this.move = function() 
			{
						if(u)this.y -= 0.7;
						else if(d)this.y += 0.7;
						else if(l)this.x-= 0.7;
						else if(r)this.x += 0.7;
			}
		
	}
function createHero() 
	{
		hero = new heroClass();
	}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


function enemyClass()
	{
		this.x
		this.y
		
		this.u = false
		this.d = false
		this.l = false
		this.r = false
		
		this.bX;
		this.bY;
		this.bW;
		this.bH;
		
		this.state = 1;
		
		this.ran;
		
		this.rMove = function()
			{
				this.ran = 	Math.floor(Math.random()*4);
			}
		this.nMove = function()
			{
				this.u = false
				this.d = false
				this.l = false
				this.r = false
			}
		this.draw = function()
			{
				ctx.fillStyle = "red"
				ctx.fillRect(this.x,this.y,7,9)
				
				ctx.fillStyle = "#bf0202"
				ctx.fillRect(this.x+1,this.y+9, 2,step[0])
				ctx.fillRect(this.x+4,this.y+9, 2,step[1])		
		
				if(this.u)
					{
					}
				else if(this.d)
					{
						ctx.fillStyle = "black"
						ctx.fillRect(this.x+2,this.y+2, 1,1)
						ctx.fillRect(this.x+4,this.y+2, 1,1)		
					}
				else if(this.l)
					{
						ctx.fillStyle = "black"
						ctx.fillRect(this.x+1,this.y+2, 1,1)
						ctx.fillRect(this.x+3,this.y+2, 1,1)
					}
				else if(this.r)
					{
						ctx.fillStyle = "black"
						ctx.fillRect(this.x+3,this.y+2, 1,1)
						ctx.fillRect(this.x+5,this.y+2, 1,1)
					}
			
				else
					{
						ctx.fillStyle = "black"
						ctx.fillRect(this.x+2,this.y+2, 1,1)
						ctx.fillRect(this.x+4,this.y+2, 1,1)
						ctx.fillStyle = "#bf0202"
						ctx.fillRect(this.x+1,this.y+9, 2,1)
						ctx.fillRect(this.x+4,this.y+9, 2,1)	
					}
			}
		this.move = function()
			{
				if(hero.x+7 > this.x-50 && hero.x < this.x+57 && hero.y+8 > this.y-50 && hero.y < this.y+60 && hero.x+7 > this.bX && hero.x < this.bX+this.bW && hero.y+8 > this.bY && hero.y < this.bY+this.bH)
					{
						this.state = 2
					}
				else
					{
						this.nMove()
						this.state = 1
					}
				if(this.state == 1)
					{
	
						if(this.ran == 0)
							{
								this.y-=.2
								this.u = true
								this.r = false
								this.d = false
								this.l = false
							}
						else if(this.ran == 1) 
							{
								this.y+=.2
								this.d = true
								this.u = false
								this.r = false
								this.l = false
							}	
						else if(this.ran == 2) 
							{
								this.x-=.2
								this.l = true
								this.u = false
								this.d = false
								this.r = false
							}	
						else if(this.ran == 3) 
							{
								this.x+=.2
								this.r = true
								this.u = false
								this.d = false
								this.l = false
							}
							
						if(this.x < this.bX)
							{
								this.x = this.bX
								this.nMove()
							}	
						if(this.x+7 > this.bX+this.bW)
							{
								this.x = this.bX+this.bW-7
								this.nMove()
							}
						if(this.y < this.bY)
							{
								this.y = this.bY
								this.nMove()
							}
						if(this.y+10 > this.bY+this.bH)
							{
								this.y = this.bY+this.bH-10
								this.nMove()
							}
					}
				else if(this.state == 2)
					{
						if(this.x+7 <= hero.x)
							{
								this.x += .3
								this.r = true
								this.u = false
								this.d = false
								this.l = false
							}
						else
							{
								this.r = false
							}
							
						if(this.x-7 >= hero.x)
							{
								this.x -= .3
								this.l = true
								this.u = false
								this.d = false
								this.r = false
							}	
						else
							{
								this.l = false
							}
													
						if(this.y+9 <= hero.y+6)
							{
								this.y += .3
								this.d = true
								this.u = false
								this.r = false
								this.l = false
							}
						else
							{
								this.d = false
							}
													
						if(this.y-7 >= hero.y+1)
							{
								this.y -= .3
								this.u = true
								this.r = false
								this.d = false
								this.l = false
							}
						else
							{
								this.u = false
							}
						
					}
			}
		this.colision = function()
			{
				if(this.x+7 > hero.x && this.x < hero.x+7 && this.y+10 > hero.y && this.y < hero.y+8 && coolDown == false && this.state == 2)
					{
						zoom+=.5
						coolDown = true
						setTimeout(function(){coolDown = false},2000)
					}
			}
	}
function createEnemy() 
	{
		var enemy = new enemyClass();
		var num = arr[Math.floor(Math.random()*arr.length)]
		enemy.x = grid[num].x
		enemy.y = grid[num].y
		
		enemys.push(enemy)
	}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////


function startGame()
	{
		document.getElementById("gameText0").style.color = "transparent"
		document.getElementById("gameText0").textContent = ""
		document.getElementById("gameText4").textContent = ""
		document.getElementById("gameText4").style.color = "transparent"
		ctx.fillStyle = "#292634"
		ctx.fillRect(0,0,canvas.width,canvas.height)
		zoom = 4;
		time = timeR
		makeGrid();
			
		createRooms(amount);
		for (var i = 0; i < grid.length; i++) 
			{
				grid[i].carve();
			}
		for (var i = 0; i < rooms.length; i++) 
			{
				rooms[i].beacons()
			}
		
		createHero();
		heroSpawn();
		beaconPlacing();
		
		for (var i = 0; i < grid.length; i++) 
			{
				grid[i].beacon();
			}
		
		for (var i = 0; i < startingAmount; i++) 
			{
				createEnemy()
			}
		
		interval[0] = setInterval(function(){createEnemy();}, 15000)	
		interval[1] = setInterval(function(){for(var i=0;i<enemys.length;i++){enemys[i].rMove()}}, 5000)
		interval[2] = setInterval(function(){step[0] = step[1]; step[1] = step[2]; step[2] = step[0];}, 200)
		
		interval[3] = setInterval(function()
			{
				switched = 0
				ctx.save();
				ctx.scale(zoom, zoom);
				ctx.translate(-hero.x+((canvas.width/2)/zoom), -hero.y+((canvas.width/2)/zoom));
				
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].show();
					}
					
				for (var i = 0; i < grid.length; i++) 
					{
						grid[i].detect()
						grid[i].collide()
						
						if(grid[i].type == 4)
							{
								switched ++;
							}
							
						if(i==grid.length-1)
							{
								document.getElementById("gameText2").style.color = "white"; document.getElementById("gameText2").textContent = switched+"/"+rooms.length+" online."
						
								if(switched == rooms.length && level == 5) 
									{
										wCS = true
										cutscene()
										endGame()
									}
								else if(switched == rooms.length)
									{
										zoom = 1
										timeR += 10
										endGame()
										level++
										time=timeR;
										amount++;
										rows+=10;
										cols+=10;
										setTimeout(function(){startGame()}, 1000)
									}
							}
					}
				
				for (var i = 0; i < rooms.length; i++) 
					{
						rooms[i].enemys()
					}
				
				for (var i = 0; i < enemys.length; i++) 
					{
						enemys[i].move()
						enemys[i].draw()
						enemys[i].colision()
					}
					
				if(zoom > 6 || time <= 0)//temporary!
					{
						zoom = 1
						endGame()
						lose = true
						//location.reload();
					}
					
				hero.draw()
				hero.move()	
				ctx.restore();
  		}, 1000/60)
			
		interval[4] = setInterval(function(){time-=1; document.getElementById("gameText1").style.color = "white"; document.getElementById("gameText1").textContent = Math.floor(time)+" seconds"}, 1000)
								document.getElementById("gameText3").style.color = "white"; 
								document.getElementById("gameText3").textContent = "Level "+level
  }
  
function endGame()
	{	
		grid = [];
		w = 10;
		
		rooms = [];
		collide = false;
	
		size = 5;			//the actuall size will be a number bettween 5 and 10 | e.g: size+sizeMin
		sizeMin = 15;
		
		disX;
		disY;
		corridorW = 1;
		
		hero;
		enemys = []
		
		step = [0,1,0]
		
		arr = [];
		
		space=u=d=l=r=0;
		
		beacons = [];
		beaconSpots = [];
		
		startingAmount = 6;
		coolDown = false;
		
		for(var i = 0; i < interval.length; i++) 
			{
						clearInterval(interval[i]);
			}
		ctx.clearRect(0,0,canvas.width,canvas.height)
		
		document.getElementById("gameText1").style.color = "transparent"
		document.getElementById("gameText1").textContent = ""
		document.getElementById("gameText2").style.color = "transparent"
		document.getElementById("gameText2").textContent = ""
		document.getElementById("gameText3").style.color = "transparent"
		document.getElementById("gameText3").textContent = ""
		
		setTimeout(function(){ctx.clearRect(0,0,canvas.width,canvas.height);}, 100)
		
		//insert cut scene here
	}
	
function reset() 
	{
		timeR = 90;
		level = 1;
		rows = 80;
		cols= 60;
		amount = 4;
	}
  
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////  
 function won()
 	{
 		if(win == true)
 			{
 				document.getElementById("gameText0").style.fontSize = "4em"
 				document.getElementById("gameText0").textContent = "You Win!"
 				document.getElementById("gameText0").style.color = "white"
 				document.getElementById("gameText4").textContent = "Click To Continue"
 				document.getElementById("gameText4").style.color = "white"
 				document.getElementById("gameText0").style.fontSize = "4em"
 				reset()
 				
 				
 				if(space){menuOn = true; win = false;space=false}
 			}
 	}
 
 function lost()
 	{
 		if(lose == true)
 			{
 				document.getElementById("gameText0").style.fontSize = "4em"
 				document.getElementById("gameText0").textContent = "You lose!"
 				document.getElementById("gameText0").style.color = "white"
 				document.getElementById("gameText4").textContent = "Click To Continue"
 				document.getElementById("gameText4").style.color = "white"
 				reset()
 				
 				
 				if(space){menuOn = true; lose = false;space=false}
 			}
 	} 
 	
 function menu()
 	{
 		if(menuOn == true)
 			{
 				document.getElementById("gameText0").textContent = "Welcome to The_Coder's Game!"
 				document.getElementById("gameText0").style.color = "white"
 				document.getElementById("gameText4").textContent = "Click To Continue"
 				document.getElementById("gameText4").style.color = "white"
 				reset()
 				
 				
 				if(space){menuOn = false; tut = true;space=false}
 			}
 	}
 	
 	function tutorial() 
 		{
 			if(tut == true && tutA == false)
 				{
 					document.getElementById("gameText0").textContent = "W/A/S/D, Z/Q/S/D, Arrow Keys to move"
 					document.getElementById("gameText0").style.fontSize = "3em"
 					document.getElementById("gameText4").textContent = "Click To Continue"
 					document.getElementById("gameText4").style.color = "white"
 					
 					
 					reset()
 					
 					if(space){tut = false; space=false; tutA=true; sCS=true;cutscene();}
 				}
 			else if(tut == true){
 				tut = false
 				sCS = true
 				cutscene()
 				space = false
 				reset()
 			}
 		}
 	function cutscene()
 		{
 			document.getElementById("gameText0").textContent = ""
 			document.getElementById("gameText0").style.color = "transparent"
 			document.getElementById("gameText4").textContent = ""
 			document.getElementById("gameText4").style.color = "transparent"
 			var aX = -100
 			var aY = canvas.width/2-10
 			
 			
 			if(sCS)
 				{
 			
 					setInterval(function()
 						{
 					
 							if(aX < canvas.width/2+50) 
 								{
 									aX+=3;
 							
 									ctx.fillStyle = "black"
 									ctx.fillRect(0,0,canvas.width,canvas.height)
 									
 									ctx.beginPath();
 									ctx.fillStyle = "#575A5E"
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY+65, aX-150, aY, 100);
 									ctx.lineTo(aX-150, aY)
 									ctx.fill()
 							
 									ctx.beginPath();
 									ctx.fillStyle = "#7E8287"
 							
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY-50, aX-150, aY, 140)
 									ctx.lineTo(aX-150, aY)
 							
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY+45, aX-150, aY, 110);
 									ctx.lineTo(aX-150, aY)
 							
 									ctx.fill()
 							
 							//squares
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-68,aY-18,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-64,aY-13,4,4)
 									ctx.fillRect(aX-56,aY-13,4,4)
 							
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-102,aY-18,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-97,aY-13,4,4)
 									ctx.fillRect(aX-89,aY-13,4,4)
 							
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-85,aY-15,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-81,aY-10,4,4)
 									ctx.fillRect(aX-73,aY-10,4,4)
 							
 							//glass
 									ctx.beginPath();
 									ctx.fillStyle = "#B5E2F4"
 									ctx.globalAlpha = 0.5
 									ctx.moveTo(aX-25, aY-5);
 									ctx.arcTo(aX-75, -(aY+45), aX-125, aY-5, 50);
 									ctx.lineTo(aX-125, aY-5)
 							
 									ctx.moveTo(aX-25, aY-5);
 									ctx.arcTo(aX-75, aY+15, aX-125, aY-5, 100);
 									ctx.lineTo(aX-125, aY-5)
 									ctx.fill()
 							
 									ctx.beginPath();
 									ctx.lineWidth = 3
 									ctx.strokeStyle = "white"
 									ctx.moveTo(aX-80, aY-40);
 									ctx.arcTo(aX-100, aY-35, aX-105, aY-20, 30);
 									ctx.lineTo(aX-105, aY-20)
 									ctx.stroke()
 									ctx.globalAlpha = 1
 								}
 						}, 1000/60)
 						
 						setTimeout(function()
 							{	
 								ctx.font = "15px Arial"
 								ctx.fillStyle = "white"
 								ctx.fillText("Where is he?", 450, 300)
 							}, 3500)
 							
 						setTimeout(function()
 							{	
 								ctx.fillStyle = "black"
 								ctx.fillRect(400,250,200,50)
 								ctx.fillStyle = "white"
 								ctx.fillText("He must have fallen out!", 450, 300)
 							}, 6500)
 							
 						setTimeout(function()
 							{	
 								ctx.fillStyle = "black"
 								ctx.fillRect(400,250,250,50)
 								ctx.fillStyle = "white"
 								
 								var txt = 'Lets hope he can get the beacons \n online so we can find him in time!';
 								var lineheight = 15;
 								var lines = txt.split('\n');
 								
 								for (var i = 0; i<lines.length; i++)
 									{
 								    ctx.fillText(lines[i], 450, 300 + (i*lineheight) );
 								  }
 							}, 9500)
 							
 						setTimeout(function(){startGame(); sCS = false}, 12500)
 					
 				}
 			else if(wCS) 
 				{
 					aX = canvas.width/2+50
 					aY = 100
 					setTimeout(function(){ 
 									ctx.beginPath();
 									ctx.fillStyle = "#575A5E"
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY+65, aX-150, aY, 100);
 									ctx.lineTo(aX-150, aY)
 									ctx.fill()
 								
 									ctx.beginPath();
 									ctx.fillStyle = "#7E8287"
 								
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY-50, aX-150, aY, 140)
 									ctx.lineTo(aX-150, aY)
 								
 									ctx.moveTo(aX, aY);
 									ctx.arcTo(aX-75, aY+45, aX-150, aY, 110);
 									ctx.lineTo(aX-150, aY)
 								
 									ctx.fill()
 								
 								//squares
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-68,aY-18,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-64,aY-13,4,4)
 									ctx.fillRect(aX-56,aY-13,4,4)
 								
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-102,aY-18,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-97,aY-13,4,4)
 									ctx.fillRect(aX-89,aY-13,4,4)
 								
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-85,aY-15,20,20)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-81,aY-10,4,4)
 									ctx.fillRect(aX-73,aY-10,4,4)
 								
 								//glass
 									ctx.beginPath();
 									ctx.fillStyle = "#B5E2F4"
 									ctx.globalAlpha = 0.5
 									ctx.moveTo(aX-25, aY-5);
 									ctx.arcTo(aX-75, -(aY+45), aX-125, aY-5, 50);
 									ctx.lineTo(aX-125, aY-5)
 								
 									ctx.moveTo(aX-25, aY-5);
 									ctx.arcTo(aX-75, aY+15, aX-125, aY-5, 100);
 									ctx.lineTo(aX-125, aY-5)
 									ctx.fill()
 								
 									ctx.beginPath();
 									ctx.lineWidth = 3
 									ctx.strokeStyle = "white"
 									ctx.moveTo(aX-80, aY-40);
 									ctx.arcTo(aX-100, aY-35, aX-105, aY-20, 30);
 									ctx.lineTo(aX-105, aY-20)
 									ctx.stroke()
 									ctx.globalAlpha = 1
 									
 									ctx.fillStyle = "#489551"
 									ctx.fillRect(0, aY+318, canvas.width, canvas.height)
 									ctx.fillStyle = "#6FAE53"
 									ctx.fillRect(0, aY+318, canvas.width, 5)
 									
 									ctx.fillStyle = "white"
 									ctx.fillRect(aX-100,aY+300,40,40)
 									ctx.fillStyle = "black"
 									ctx.fillRect(aX-92,aY+308,8,8)
 									ctx.fillRect(aX-78,aY+308,8,8)
 									
 									},1000)
 							
 						setTimeout(function()
 							{	
 								ctx.font = "15px Arial"
 								ctx.fillStyle = "white"
 								ctx.fillText("We found you!", 450, 50)
 							}, 1000)
 								
 							setTimeout(function(){endGame(); wCS = false; win=true}, 5000)
 						
 				}
 		}
 		
  
  setInterval(function(){lost();won();menu();tutorial()}, 100)
  canvas.addEventListener('mousedown',handleMouseClick);
  
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////  
  function index(i, j) {
   if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
     return -1;
   }
   return i + j * cols;
  }
  
  function heroSpawn()
  	{
  		
  		for(var i = 0; i < grid.length; i++)
  			{
  				if(grid[i].type == 1)
  					{
  						arr.push(i)
  					}
  			}
  		var num = arr[Math.floor(Math.random()*arr.length)]
  		hero.x = grid[num].x
  		hero.y = grid[num].y
  		
  	}
  function beaconPlacing() 
  	{	
  		for(var i = 0; i < rooms.length; i++) 
  			{ 
  				  beacons[i] = beaconSpots[i][Math.floor(Math.random()*beaconSpots[i].length)]
  			}

  	}
  
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

onkeydown=(e)=>t(e,1);onkeyup=(e)=>t(e);t=(e,v,l,i)=>{for(i in l={u:[38,90,87],r:[39,68],d:[40,83],l:[37,65,81]})if(l[i].includes(e.keyCode))window[i]=v}

function handleMouseClick(evt)
{
		space = true
		console.log(space)
}
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
	
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// 

 


//sound = true;
// setInterval(function(){
// if(sound == true){
//with(new AudioContext)
//with(G=createGain())
//for(i in 
//D=[6,7,6,7,6,11,8,10,13,13,25,22,18,13,11,11,25,18,14,11,10,10,25,18,6,7,6,7,6,11,8,10,13,13,25,22,18,13,11,11,25,18,10,11,13,13,25,,6,7,6,7,6,11,8,10,13,13,25,22,18,13,11,11,25,18,14,11,10,10,25,18,6,7,6,7,6,11,8,10,13,13,25,22,18,13,11,11,25,18,10,11,13,13,25,11,10,8,6,6,6,6,15,5,6,8,8,8,8,17,6,8,10,10,10,10,18,8,10,11,11,11,11,18,18,6,18,6,6,1,7,6,7,6,7,6,7])
//with(createOscillator())
//if(D[i])
//connect(G),
//G.connect(destination),
//start(i*.15),
//frequency.setValueAtTime(1760*1.06**(13-D[i]),i*.15),type='square',
//gain.setValueAtTime(1,i*.15),
//gain.setTargetAtTime(.0001,i*.15+.13,.005),
//stop(i*.15+.14)
//}
// }, 20000)
 
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////  
  
//with(new AudioContext)[9,9,12,12,12,12,14,14,14,14,14,14,14,14,16,16,16,16,16,16,19,19,21,21].map((v,i)=>{with(createOscillator())v&&start(e=[2,31,13,18,43,48,11,15,21,27,41,45,51,57,10,24,29,40,55,59,6,35,4,33][i]/5,connect(destination),frequency.value=988/1.06**v)+stop(e+.2)})

////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// 



//with(new AudioContext)
//with(G=createGain())
//for(i in D=[,12,8,,11,,,9,,15,,,,21,,16,,10])
//
//with(createOscillator())
//if(D[i])
//connect(G),
//G.connect(destination),
//start(i*.05),
//frequency.setValueAtTime(4040*1.06**(13-D[i]),i*.05),
//gain.setValueAtTime(1,i*.05),
//gain.setTargetAtTime(.0001,i*.05+.03,.005),
//stop(i*.05+.04)
//
//with(new AudioContext)
//with(G=createGain())
//for(i in D=[,12,8,,11,,,9,,15,,,,21,,16,,10])
//with(createOscillator())
//if(D[i])
//connect(G),
//G.connect(destination),
//start(i*.05),
//frequency.setValueAtTime(100*1.06**(13-D[i]),i*.05),
//gain.setValueAtTime(1,i*.05),
//gain.setTargetAtTime(.0001,i*.05+.03,.005),
//stop(i*.05+.04)

//with(new AudioContext)
//with(G=createGain())
//for(i in D=[1,13,25])
//with(createOscillator())
//if(D[i])
//connect(G),
//G.connect(destination),
//start(i*.05),
//frequency.setValueAtTime(100*1.06**(13-D[i]),i*.05),type='square',
//gain.setValueAtTime(0.1,i*.05),
//gain.setTargetAtTime(.0001,i*.05+.03,.005),
//stop(i*.05+.04)
//function sound()
//	{
//with(new AudioContext)
//with(G=createGain())
//for(i in D=[1])
//with(createOscillator())
//if(D[i])
//connect(G),
//G.connect(destination),
//start(i*.05),
//frequency.setValueAtTime(100*1.06**(13-D[i]),i*.05),
//gain.setValueAtTime(1,i*.05),
//gain.setTargetAtTime(.0001,i*.05+.03,.005),
//stop(i*.05+.04)
//	}

////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////// 

//A=new AudioContext;
//G=A.createGain();
//for(i in D=[10,10,10,15,15,15,10,10,10,15,15,15,10,10,10,10,8,10,11,,,,,15,11,11,11,15,15,15,11,11,11,15,15,15,15,15,15,15,13,11,10,,,15,,15,10,10,10,15,15,15,10,10,10,15,15,15,10,10,10,10,8,10,11,,,,,15,11,11,11,15,15,15,11,11,11,15,15,15,3,1,3,5,6,8,10,,,3,,3,3,6,6,6,10,10,10,15,15,15,18,17,15,13,11,10,8,6,5,,,,5,5,5,8,8,8,11,11,11,15,15,15,3,3,3,1,3,5,6,8,10,6,3,15,,3,13,,3,11,,3]){
//  O=A.createOscillator();
//  if(D[i])
//      O.connect(G),
//      G.connect(A.destination);
//      O.start(i*.2);
//      O.frequency.setValueAtTime(415*1.06**(13-D[i]),i*.2),
//      G.gain.setValueAtTime(.5, i*.2); 
//      G.gain.setTargetAtTime(0.0001, i*.2+.18,.005)
//      O.stop(i*.2+.19);
//}                       