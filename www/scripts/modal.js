$(document).ready(function() {

  var hasOpened = false;

  $("#modal").iziModal({
    onOpening: function(modal){
      modal.startLoading();

      if (hasOpened) {
        modal.stopLoading();
      } else {
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
          eventAfterAllRender: function () {
            hasOpened = true;
            modal.stopLoading();
          }
        });
      }
    }
  });

  $(document).on('click', '.trigger', function (event) {
    event.preventDefault();
    $('#modal').iziModal('open');
  });

});
