/* eslint-disable */
$(document).ready(function () {
  // 显示隐藏back top
  $(window).scroll(function() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > 100) {
      $('.back-top').fadeIn();
    } else {
      $('.back-top').fadeOut();
    }
  });

  Utils.backTop();
  Utils.headerDropMenu();
  Utils.modalSelect();
});
