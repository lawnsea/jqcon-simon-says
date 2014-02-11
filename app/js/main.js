require.config({
  baseUrl: 'js/'
});

require([
  'button'
],
function (
  Button
) {
  Button.attachTo('.game-board button');

  $(document).on('activation', function (e) {
    console.log($(e.target).data('color'));
  });
});
