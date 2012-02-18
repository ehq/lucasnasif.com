$(document).ready(function() {
  // Start the Game of Life widget.
  GoL.init($("#gol"), { 'size': 150, 'speed': 100 });

  $("#enjoy_the_show").click(function() {
    $("footer, .controls, #fork_me").fadeIn("slow");
    $("#info_container").fadeOut("slow");
    $("#gol_container").animate({ "opacity": 1 }, 3000, function() {
      $("#gol_container").animate({class: "cool"}, 5000);
    });
  });
});
