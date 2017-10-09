$(document).ready(function() {
  var dayTemplate = $('#dayTemplate').html();
  Mustache.parse(dayTemplate);
  var today = new Date();
  for (var i = 0; i < 20; i++) {
    var row = $('<div class="row"></div>');
    for (var j = 0; j < 7; j++) {
      var dayRendered = Mustache.render(dayTemplate, { date: today.toString().substr(0,10) });
      today.setDate(today.getDate() + 1);
      row.append($(dayRendered));
    }
    $('.o' + (Math.floor(i/5)+1)).append(row);
  }


  $('.material-icons').on('click', function() {
    $icon = $(this);
    $other = $($icon.siblings()[1]);
    $icon.css('color', 'yellow');
    $other.fadeOut();
  });

  $('#fullpage').fullpage();
});