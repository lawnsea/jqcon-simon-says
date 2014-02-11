require.config({
  baseUrl: 'js/'
});

require([
  'game'
],
function (
  Game
) {
  $(function () {
    Game.attachTo(document);

    $(document).on('activation', function (e, data) {
      console.log(data.color);
    });

    $(document).on('success', function () {
      console.log('success');
    });

    $(document).on('failure', function (e, data) {
      console.log('expected', data.expected, 'but saw', data.actual);
    });
  });
});
