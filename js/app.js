$(document).ready(function() {
  // Start the Game of Life widget.
  GoL3D.init($("#gol"), { 'size': 200, 'speed': 150 });

  // FIXME: WIP. These still look a bit odd...
  $("#enjoy_the_show").click(function() {
    $("#info_container").fadeOut("slow");
    GoL3D.transition(-2000, 1600, 2800);
    GoL3D.transition(800, 200, 100);
    GoL3D.transition(5500, 200, 100);
    GoL3D.transition(-3000, 200, 400);
    GoL3D.transition(-4000, 200, -400);
    GoL3D.transition(0, 200, -400);
    GoL3D.transition(200, 200, -400);
    GoL3D.transition(200, 200, -400);
    GoL3D.transition(200, 200, 400);
    GoL3D.transition(400, 200, 550);
    GoL3D.transition(600, 200, 700);
    GoL3D.transition(1200, 100, 900);
    GoL3D.transition(1400, 600, 1400);
  });

  $("#read_more").click(function() {
    $(this).parent().hide();
    $(".read_more").fadeIn(5000);
    GoL3D.transition(6000, 300, 800);
  });
});
