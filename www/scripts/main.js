window.isModalOpened = false;
window.isFireworkStarted = false;

var loadCalendar = function(cb) {
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
    eventAfterAllRender: cb,
  });
};

var loadFirework = function() {
  document.getElementById("firework-container").appendChild(fireworkCanvas);
  fireworkCanvas.width = SCREEN_WIDTH;
  fireworkCanvas.height = SCREEN_HEIGHT;
  setInterval(launchFirework, 800);
  setInterval(loopFirework, 1000 / 50);
  window.isFireworkStarted = true;
};

var clearModal = function(modal) {
  $('#modal').iziModal('close');
  window.isModalOpened = false;

  if (window.isFireworkStarted) {
    document.getElementById("firework-container").innerHTML = "";
    window.isFireworkStarted = false;
  }
};

var toggleModal = function(currentInput) {
  if (window.isModalOpened || currentInput.intentName == 'clear') {
    clearModal(modal);
  } else if (window.isModalOpened) {
    var containers = document.getElementById("modal").children;
    for (var i = 0; i < containers.length; ++i) {
      if (containers[i].children.length > 0) {
        containers[i].innerHTML = "";
      }
    }
  }

  if (currentInput.intentName == 'Beautiful') {
    loadFirework();
    return;
  }

  $("#modal").iziModal({
    onOpening: function(modal){
      modal.startLoading();

      var cb = function() {
        modal.stopLoading();
        window.isModalOpened = true;
      };

      switch (currentInput.intentName) {
        case 'Calendar':
          loadCalendar(cb);
          break;
        case 'Stock':
          loadStock(cb);
          break;
      }
    },
    group : 'modals'
  });

  $('#modal').iziModal('open');
};

var processInput = function (currentInput) {
  if (typeof currentInput.intentName == 'undefined') {
    clearModal();
    return;
  } else if (currentInput.dialogState == 'Next'){
      $('#modal').iziModal('next');
  } else if (currentInput.dialogState == 'Prev'){
      $('#modal').iziModal('prev');
  }
  else if (currentInput.dialogState != 'ReadyForFulfillment') {
    clearModal();
    return;
  }
  toggleModal(currentInput);
};
