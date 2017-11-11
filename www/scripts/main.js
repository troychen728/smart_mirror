window.isModalOpened = false;

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

var toggleModal = function(currentInput) {
  if (window.isModalOpened) {
    var containers = document.getElementById("modal").children;
    for (var i = 0; i < containers.length; ++i) {
      if (containers[i].children.length > 0) {
        containers[i].innerHTML = "";
      }
    }
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
    }
  });

  $('#modal').iziModal('open');
};

var processInput = function (currentInput) {
  if (typeof currentInput.intentName == 'undefined') {
    return;
  }

  toggleModal(currentInput);
};
