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
  });
});
