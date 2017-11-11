window.shouldOpenModal = false;
window.isModalOpened = false;
window.isFireworkStarted = false;

window.containerList = [
    "calendar-container",
    "weather-container",
    "stock-container",
    "map-container",
    "game-container",
];

var loadCalendar = function(cb) {
  $('#calendar-container').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'listWeek,listDay'
    },
    defaultView: 'listWeek',
    editable: true,
    googleCalendarApiKey: 'AIzaSyBVr__FHZ_zjXWEmNnPARenKsHXiZPlRxc',
    events: {
      googleCalendarId: '2017smartmirror2017@gmail.com'
    },
  });

  document.getElementById('calendar-container').classList.remove('inactive');
  cb();
};

var loadWeather = function(cb,city){

  $.simpleWeather({
    location: city,
    woeid: '',
    unit: 'f',
    success: function(weather) {
      html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
      html += '<li class="currently">'+weather.currently+'</li>';
      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';

      $("#weather-container").html(html);
      cb();
    },
    error: function(error) {
      $("#weather-container").html('<p>'+error+'</p>');
      cb();
    }
  });

  document.getElementById('weather-container').classList.remove('inactive');
};

var loadMapDirections = function(cb,destination){
  var mapContainer = document.getElementById("map-container");
  while (mapContainer.hasChildNodes()) {
    mapContainer.removeChild(mapContainer.lastChild);
  }
  var mapIFrame = document.createElement("IFRAME");
  mapIFrame.setAttribute('width', '600');
  mapIFrame.setAttribute('height', '750');
  mapIFrame.setAttribute('frameborder', '0');
  mapIFrame.setAttribute('style', 'border:0');
  if (destination == "work") {
    destination = "Bauer+Center";
  } else if (destination == "school") {
    destination = "Harvey+Mudd+College";
  } else if (destination == "home") {
    destination = "College+Park+Apartment+Homes"
  } else if (destination == "gym") {
    destination = "LA+Fitness"
  }
  mapIFrame.setAttribute('src', 'https://www.google.com/maps/embed/v1/directions?key=AIzaSyCrwiBAYIUr_b0bqB8RzYEhmF846TwC7Zg&origin=Edmunds+Ballroom&destination=' + destination);
  mapContainer.appendChild(mapIFrame);

  document.getElementById('map-container').classList.remove('inactive');
  cb();
}

var loadStock = function(cb){
  document.getElementById('stock-container').classList.remove('inactive');
  cb();
};

var loadFirework = function() {
  document.getElementById("firework-container").appendChild(fireworkCanvas);
  fireworkCanvas.width = SCREEN_WIDTH;
  fireworkCanvas.height = SCREEN_HEIGHT;
  setInterval(launchFirework, 800);
  setInterval(loopFirework, 1000 / 50);
  document.getElementById('easteregg').play();
  window.isFireworkStarted = true;
};

var loadGame = function(cb) {
  var canvas = document.getElementById("game-container");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'rgb(3,3,3)';
  var ballRadius = 10;
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 4;
  var dy = -4;
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth)/2;
  var rightPressed = false;
  var leftPressed = false;
  var brickRowCount = 5;
  var brickColumnCount = 3;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;
  var score = 0;
  var lives = 3;
  var controller = new Leap.Controller();
  controller.connect();

  var bricks = [];
  for(c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
  }
  
  // document.addEventListener("mousemove", mouseMoveHandler, false);
  controller.on('frame', leapMotionHandler);
  // function mouseMoveHandler(e) {
  //     var relativeX = e.clientX - canvas.offsetLeft;
  //     if(relativeX > 0 && relativeX < canvas.width) {
  //         paddleX = relativeX - paddleWidth/2;
  //     }
  // }
  function leapMotionHandler(frame) {
    if (frame.pointables.length > 0) {
      var leapPoint = frame.pointables[0].stabilizedTipPosition;
      var normalizedPoint = frame.interactionBox.normalizePoint(leapPoint, true);

      var appWidth = 600;

      var appX = normalizedPoint[0] * appWidth;

      var relativeX = appX - canvas.offsetLeft;
      if(relativeX > 0 && relativeX < canvas.width) {
          paddleX = relativeX - paddleWidth/2;
      }
    }
  }

  function collisionDetection() {
      for(c=0; c<brickColumnCount; c++) {
          for(r=0; r<brickRowCount; r++) {
              var b = bricks[c][r];
              if(b.status == 1) {
                  if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                      dy = -dy;
                      b.status = 0;
                      score++;
                      if(score == brickRowCount*brickColumnCount) {
                          // alert("YOU WIN, CONGRATS!");
                          document.location.reload();
                      }
                  }
              }
          }
      }
  }

  function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
  }
  function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
  }
  function drawBricks() {
      for(c=0; c<brickColumnCount; c++) {
          for(r=0; r<brickRowCount; r++) {
              if(bricks[c][r].status == 1) {
                  var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                  var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                  bricks[c][r].x = brickX;
                  bricks[c][r].y = brickY;
                  ctx.beginPath();
                  ctx.rect(brickX, brickY, brickWidth, brickHeight);
                  ctx.fillStyle = "#0095DD";
                  ctx.fill();
                  ctx.closePath();
              }
          }
      }
  }
  function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Score: "+score, 8, 20);
  }
  function drawLives() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(3,3,3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();
      
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
      }
      if(y + dy < ballRadius) {
          dy = -dy;
      }
      else if(y + dy > canvas.height-ballRadius) {
          if(x > paddleX && x < paddleX + paddleWidth) {
              dy = -dy;
          }
          else {
              lives--;
              if(!lives) {
                  // alert("GAME OVER");
                  document.location.reload();
              }
              else {
                  x = canvas.width/2;
                  y = canvas.height-30;
                  dx = 3;
                  dy = -3;
                  paddleX = (canvas.width-paddleWidth)/2;
              }
          }
      }
      
      if(rightPressed && paddleX < canvas.width-paddleWidth) {
          paddleX += 7;
      }
      else if(leftPressed && paddleX > 0) {
          paddleX -= 7;
      }
      
      x += dx;
      y += dy;
      requestAnimationFrame(draw);
  }

  draw();
  cb();
}

var clearModal = function() {
  $('#modal').iziModal('close');

  if (window.isFireworkStarted) {
    document.getElementById("firework-container").innerHTML = "";
    window.isFireworkStarted = false;
  }
};

var toggleModal = function() {
  if (window.isModalOpened || currentInput.intentName == 'clear') {
    clearModal();
    if (currentInput.intentName == 'clear') {
      return;
    }
  }

  if (currentInput.intentName == 'Beautiful') {
    loadFirework();
    return;
  }

  if ($('#modal').iziModal('getState') == 'closed') {
    $('#modal').iziModal('open');
  } else {
    window.shouldOpenModal = true;
  }
};

var processInput = function (currentInput) {
  if (typeof currentInput.intentName == 'undefined') {
    clearModal();
    return;
  } else if (currentInput.dialogState != 'ReadyForFulfillment') {
    clearModal();
    return;
  }

  window.currentInput = currentInput;
  toggleModal();
};

$(document).ready(function() {

  for (var i = 0; i < window.containerList.length; ++i) {
    if ($("#" + window.containerList[i]).children.length > 0) {
      document.getElementById(window.containerList[i]).classList.add('inactive');
    }
  }

  $("#modal").iziModal({
    onOpening: function(modal) {
      modal.startLoading();

      var cb = function() {
        modal.stopLoading();
      };

      switch (currentInput.intentName) {
        case 'Calendar':
          loadCalendar(cb);
          break;

        case 'TodaysWeather':
          loadWeather(cb, currentInput.slots.Location);
          break;

        case 'stock':
          loadStock(cb);
          break;

        case 'trafficintent':
          loadMapDirections(cb, currentInput.slots.Destination);
          break;

        case 'Game':
          loadGame(cb);
          break;
      }
    },
    onOpened: function() {
      window.shouldOpenModal = false;
      window.isModalOpened = true;
    },
    onClosed: function() {
      window.isModalOpened = false;
      for (var i = 0; i < window.containerList.length; ++i) {
        if ($("#" + window.containerList[i]).children.length > 0) {
          document.getElementById(window.containerList[i]).classList.add('inactive');
        }
      }

      if (window.shouldOpenModal) {
        $('#modal').iziModal('open');
      }
    }
  });
});
