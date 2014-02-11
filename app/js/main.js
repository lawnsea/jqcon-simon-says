require.config({
  baseUrl: 'js/'
});

require([
  'game-board'
],
function (
  GameBoard
) {
  GameBoard.attachTo('.game-board');

  $(document).on('activation', function (e) {
    console.log($(e.target).data('color'));
  });
});
