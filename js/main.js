
const flip = function ($icon, $other, $result, $wrapper) {
  const isStar = $icon.text().indexOf('star') > -1;

  if (!isStar) {
    $result.addClass('red');
    $result.find('i').text('sentiment_very_dissatisfied');
    $wrapper.addClass('flip');
  } else {
    $result.addClass('yellow');
    $result.find('i').text('star');
    $wrapper.addClass('flip');
  }
};

const unflip = function ($icon, $othe, $result, $wrapper) {
  $wrapper.removeClass('flip').off('click');
  $result.removeClass('yellow red');

  wireUpCards();
};

const wireUpCards = function () {
  $('.material-icons').off('click').on('click', function (e) {
    e.stopPropagation();
    $icon = $(this);
    $other = $($icon.siblings()[1]);

    const $wrapper = $icon.closest('.card-wrapper');
    const $result = $wrapper.find('.result');
    $wrapper.find('.material-icons').off('click');

    flip($icon, $other, $result, $wrapper);

    $wrapper.on('click', function () {
      unflip($icon, $other, $result, $wrapper);
    });
  });
};

$(document).ready(function () {
  var dayTemplate = $('#dayTemplate').html();
  Mustache.parse(dayTemplate);
  var today = new Date();
  for (var i = 0; i < 20; i++) {
    var row = $('<div class="row"></div>');
    for (var j = 0; j < 7; j++) {
      var dayRendered = Mustache.render(dayTemplate, { date: today.toString().substr(0, 10) });
      today.setDate(today.getDate() + 1);
      row.append($(dayRendered));
    }
    $('.o' + (Math.floor(i / 5) + 1)).append(row);
  }

  wireUpCards();

  //$('#fullpage').fullpage();
});