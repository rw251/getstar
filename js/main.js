let isReady = false;
let isData = false;
let data = {};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

localforage.getItem('d').then(function (val) {
  isData = true;
  console.log(val);
  if (val) data = val;
  if (isReady && isData) init();
});

const updateLocal = () => {
  localforage.setItem('d', data).catch(err => console.log(err));
};

const flip = function ($icon, $other, $result, $wrapper) {
  const isStar = $icon.text().indexOf('star') > -1;
  const dateString = $wrapper.data('date');

  if (!isStar) {
    $result.addClass('red');
    $result.find('i').text('sentiment_very_dissatisfied');
    $wrapper.addClass('flip');
    data[dateString] = false;
  } else {
    $result.addClass('yellow');
    $result.find('i').text('star');
    $wrapper.addClass('flip');
    data[dateString] = true;
  }
  updateLocal();
};

const unflip = function ($result, $wrapper) {
  $wrapper.removeClass('flip').off('click');
  $result.removeClass('yellow red');
  const dateString = $wrapper.data('date');
  delete data[dateString];

  updateLocal();
  wireUpCards();
};

const wireUpCards = function () {
  $('.material-icons.sad,.material-icons.star').off('click').on('click', function (e) {
    e.stopPropagation();
    $icon = $(this);
    $other = $($icon.siblings()[1]);

    const $wrapper = $icon.closest('.card-wrapper');
    const $result = $wrapper.find('.result');
    $wrapper.find('.material-icons').off('click');

    flip($icon, $other, $result, $wrapper);

    $wrapper.on('click', function () {
      unflip($result, $wrapper);
    });
  });
  $('.card-wrapper.flip').off('click').on('click', function (e) {
    e.stopPropagation();

    const $wrapper = $(this);
    const $result = $wrapper.find('.result');
    $wrapper.find('.material-icons').off('click');

    unflip($result, $wrapper);
  });
};

const init = () => {
  var dayTemplate = $('#dayTemplate').html();
  Mustache.parse(dayTemplate);
  var today = new Date();
  var startDate = new Date(2017, 9, 9);
  for (var i = 0; i < 2000; i++) {
    var row = $('<div class="row"></div>');
    for (var j = 0; j < 7; j++) {
      var displayDate = startDate.toString().substr(0, 10);
      var dayRendered = Mustache.render(dayTemplate, {
        isStar: displayDate in data ? data[displayDate] : false,
        isSad: displayDate in data ? !data[displayDate] : false,
        date: displayDate,
        isFuture: startDate > today
      });
      startDate.setDate(startDate.getDate() + 1);
      row.append($(dayRendered));
    }
    $('#fullpage').append(row);
    if (i > 3 && startDate > today) break;
  }

  wireUpCards();
};

$(document).ready(function () {
  isReady = true;
  if (isReady && isData) init();
});