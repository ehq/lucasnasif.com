$(document).ready(function() {
  // Start the Game of Life widget.
  GoL3D.init($("#gol"), { 'size': 150, 'speed': 100 });

  $("#enjoy_the_show").click(function() {
    // $("footer, .controls, #fork_me").fadeIn("slow");
    // $("#info_container").fadeOut("slow");
  });

  $("#read_more").click(function() {
    GoL3D.should_push_right = true;
  });
});
