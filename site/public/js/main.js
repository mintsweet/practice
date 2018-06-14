$(document).ready(function () {
  // toc 固定和back top 显示
  $(window).scroll(function(event) {
    var tocTop = $(window).scrollTop();
    if (tocTop > 100) {
      $('.toc').addClass('toc-fixed');
      $('.back-top').fadeIn();
    } else {
      $('.toc').removeClass('toc-fixed');
      $('.back-top').fadeOut();
    }
  });

  // back top 回到顶部
  $(".back-top").click(function() {
    $('html, body').animate({ scrollTop: 0 },500);
    return false;
  });

  // select 展现
  $('.select').click(function() {
    $('.select .select-options').slideToggle();
  });

  // select option 选择
  $('.option').click(function(e) {
    $('.select-input').text($(this).attr('data-value'));
    $('.select-hidden').val($(this).attr('data-value'));
  });
});