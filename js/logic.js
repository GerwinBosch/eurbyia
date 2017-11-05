$("#scroll_button").click(function() {
  $('html,body').animate({
        scrollTop: $("#map_nav").offset().top},
      2000);
});

$("#about-btn").click(function() {
    $('html,body').animate({
            scrollTop: $("#about-nav").offset().top},
        2000);
});

$("#footer-btn").click(function() {
    $('html,body').animate({
            scrollTop: $("#footer-nav").offset().top},
        2000);
});