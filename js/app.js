$(document).ready(function() {
  // Start the Game of Life widget.
  GoL3D.init($("#gol"), { 'size': 150, 'speed': 100 });

  $("#enjoy_the_show").click(function() {
    // $("footer, .controls, #fork_me").fadeIn("slow");
    // $("#info_container").fadeOut("slow");

    $("#info_container").fadeOut("slow");
    GoL3D.transition(-2000, 1600, 3800);
    GoL3D.transition(1400, 0, 400);
    GoL3D.transition(400, -1000, -1400);
    GoL3D.transition(1400, 600, 1400);
  });

  $("#read_more").click(function() {
    $(this).parent().hide();
    $(".read_more").fadeIn(5000);
    GoL3D.transition(6000, 300, 800);
  });
});
