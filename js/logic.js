$("#scroll_button").click(function() {
  $('html,body').animate({
        scrollTop: $("#map_container").offset().top},
      2000);
});