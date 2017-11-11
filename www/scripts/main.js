window.shouldOpenModal = false;
window.isModalOpened = false;
window.isFireworkStarted = false;

window.containerList = [
    "calendar-container",
    "weather-container",
    "stock-container",
    "map-container",
];

var loadCalendar = function(cb) {
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
  mapIFrame.setAttribute('width', '450');
  mapIFrame.setAttribute('height', '250');
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
  cb();

  document.getElementById('map-container').classList.remove('inactive');
}

var loadFirework = function() {
  document.getElementById("firework-container").appendChild(fireworkCanvas);
  fireworkCanvas.width = SCREEN_WIDTH;
  fireworkCanvas.height = SCREEN_HEIGHT;
  setInterval(launchFirework, 800);
  setInterval(loopFirework, 1000 / 50);
  window.isFireworkStarted = true;
};

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

  $('#calendar-container').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaWeek,agendaDay'
    },
    defaultView: 'agendaDay',
    editable: true,
    googleCalendarApiKey: 'AIzaSyBVr__FHZ_zjXWEmNnPARenKsHXiZPlRxc',
    events: {
      googleCalendarId: '2017smartmirror2017@gmail.com'
    },
  });

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

        case 'Stock':
          loadStock(cb);
          break;

        case 'trafficintent':
          loadMapDirections(cb, currentInput.slots.Destination);
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
