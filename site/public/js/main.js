$(document).ready(function () {
  // toc 固定
  $(window).scroll(function(event) {
    var tocTop = $(window).scrollTop();
    if (tocTop > 100) {
      $('.toc').addClass('toc-fixed');
    } else {
      $('.toc').removeClass('toc-fixed');
    }
  });
});