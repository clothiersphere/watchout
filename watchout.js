// start slingin' some d3 here.
var collisionCount = 0;
var highScore = 0;
var currentScore = 0;

var scoreBoard = d3.select(".scoreboard");
var height = window.innerHeight
var width = window.innerWidth
// var height = window.innerHeight - d3.select('.scoreboard').style('height');
var gameboard = d3.select("body").append("svg:svg").attr("width", width).attr("height", height);
//var path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';

//// Player class /////

var Player = function(){
  this.init(width/2, height/2);
}

Player.prototype.init = function(x,y){
 this.createPlayer();
 this.setPosition(x,y);
}

Player.prototype.createPlayer = function(){
  this.circle = gameboard.append("circle");
}

Player.prototype.setPosition = function(x,y){
  this.circle.attr("cx", x).attr("cy", y).attr("r", 20);
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

var appendEnemies = function(enemy_array){
  var enemies = gameboard.selectAll('circle.enemy').data(enemy_array, function(d){ return d.id });
  enemies.enter().append('svg:circle').attr('class', 'enemy')
      .attr('cx', function(enemy) { return enemy.x })
      .attr('cy', function(enemy) { return enemy.y })
      .attr('r', 4).attr('fill','#FF66FF');
}

var moveEnemies = function(){
  return function(){
    var enemy_array = createEnemies(30);
    gameboard.selectAll('.enemy').data(enemy_array).transition().attr("cx", function(enemy) { return enemy.x }).attr("cy", function(enemy) { return enemy.y } );
    d3.timer(moveEnemies(), 500);
    return true;
  }
}

var enemies = createEnemies(30);
appendEnemies(enemies);

d3.timer(moveEnemies(), 500);










