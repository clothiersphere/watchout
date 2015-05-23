// start slingin' some d3 here.
var collisionCount = 0;
var highScore = 0;
var currentScore = 0;

var scoreBoard = d3.select(".scoreboard");
var height = window.innerHeight
var width = window.innerWidth
var nEnemies = 25;
var collisionE={};
// var height = window.innerHeight - d3.select('.scoreboard').style('height');
var gameboard = d3.select("body").append("svg:svg").attr("width", width).attr("height", height);
//var path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
////  SCORE //////

var updateScore = function(){
  d3.select(".collisions span").text(collisionCount);
  //console.log(collisionCount + " outside");
  if(!highScore || currentScore > highScore){
    highScore = currentScore;
  }
  currentScore = 0;
  //collisionCount = 0;
  d3.select(".current span").text(currentScore);
  d3.select(".high span").text(highScore);
  //d3.select(".collisions span").text(collisionCount);
  //console.log(collisionCount + " inside");
}


//// Player class /////

var Player = function(){
  this.init(width/2, height/2);
}

Player.prototype.init = function(x,y){
 this.createPlayer();
 this.setPosition(x,y);
 this.setDraggable();
}

Player.prototype.moveRelative = function(dx, dy){
  this.setPosition(this.x + dx, this.y + dy);
}

Player.prototype.dragMove = function() {
  this.moveRelative(d3.event.dx, d3.event.dy);
};

Player.prototype.setDraggable = function(){
  this.drag = d3.behavior.drag().on('drag', this.dragMove.bind(this));
  this.circle.call(this.drag);
}

Player.prototype.createPlayer = function(){
  this.circle = gameboard.append("circle");
}

Player.prototype.setPosition = function(x,y){
  this.x = x;
  this.y = y;
  this.r = 40;
  this.circle.attr("cx", x).attr("cy", y).attr("r", this.r);
}


var player = new Player();

////// Create enemies ///////

var createEnemies = function(n){
  var enemies = []
  for(var i = 0; i<n ; i++){
    enemies.push({id: i, x: Math.random()* width, y: Math.random()*height});
    //gameboard.append()
  }
  return enemies
}
var enemies = gameboard.selectAll('.enemy');

var appendEnemies = function(enemy_array){
  enemies = gameboard.selectAll('circle.enemy').data(enemy_array, function(d){ return d.id });
  enemies.enter().append('svg:circle').attr('class', 'enemy')
      .attr('cx', function(enemy) { return enemy.x })
      .attr('cy', function(enemy) { return enemy.y })
      .attr('r', 8).attr('fill','#FF66FF');
}

var moveEnemies = function(){
  return function(){
    var enemy_array = createEnemies(nEnemies);
    gameboard.selectAll('.enemy').data(enemy_array, function(d){ return d.id }).transition().duration(1500)
    .attr("cx", function(enemy) { return enemy.x }).attr("cy", function(enemy) { return enemy.y }).tween("custom", function(){
      return function(t){
        var enemy = d3.select(this);
        tweenWithCollisionDetection(enemy);
      }
    });


    d3.timer(moveEnemies(), 1500);
    return true;
  }
}

var enemies = createEnemies(nEnemies);
appendEnemies(enemies);

d3.timer(moveEnemies(), 0);

var tweenWithCollisionDetection = function(enemy){
  //console.log("called tween" );
  //var enemy = d3.select(this);
  var radiusSum, separation, xDiff, yDiff;
  radiusSum = parseFloat(enemy.attr('r')) + player.r;
  xDiff = parseFloat(enemy.attr('cx')) - player.x;
  yDiff = parseFloat(enemy.attr('cy')) - player.y;
  separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

  //debugger;
  if(separation >= radiusSum){
      collisionE[enemy.data()[0].id] = true;
  }
  if (separation < radiusSum ) {
    if(collisionE[enemy.data()[0].id]){
      collisionE[enemy.data()[0].id] = false;
      collisionCount++;
      updateScore();
    }
  }
}

setInterval(function(){
  currentScore++;
  d3.select(".current span").text(currentScore);
}, 1000)


/// collision detection ////
///

