/* eslint-disable */
$(document).ready(function () {
  // toc 固定和back top 显示
  $(window).scroll(function() {
    var tocTop = $(window).scrollTop();
    if (tocTop > 100) {
      $('.toc').addClass('toc-fixed');
      $('.back-top').fadeIn();
    } else {
      $('.toc').removeClass('toc-fixed');
      $('.back-top').fadeOut();
    }
  });

  // 下拉菜单
  $('.header .info').hover(function() {
    $('.drop-menus').stop(true, false).slideToggle();
  });

  // back top 回到顶部
  $('.back-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
    return false;
  });

  // select 展现
  $('.select').click(function() {
    $('.select .select-options').slideToggle();
  });

  // select option 选择
  $('.option').click(function() {
    $('.select-input').text($(this).text());
    $('.select-hidden').val($(this).attr('data-value'));
  });

  // 更新图形验证码
  var captcha = $('.captcha');
  captcha.click(function() {
    $.getJSON('/captcha/pic', function(res) {
      if (res.status === 1) {
        captcha.attr('src', res.data);
      } else {
        alert.text(res.message).slideDown();
        return false;
      }
    });
  });

  Utils.getSMSCode();
});
