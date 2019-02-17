(function(window, document, $) {
  const Mints = {};

  // 回到顶部
  Mints.backTop = () => {
    $(window).scroll(function() {
      const scrollTop = $(window).scrollTop();
      if (scrollTop > 100) {
        $('.back-top').fadeIn();
      } else {
        $('.back-top').fadeOut();
      }
    });

    $('.back-top').click(function() {
      $('html, body').animate({ scrollTop: 0 }, 500);
      return false;
    });
  };

  // 模态下拉框
  Mints.modalSelect = function() {
    $('.select').click(function() {
      $('.select>.options').slideToggle();
    });

    $('.option').click(function() {
      $('.select-hidden').val($(this).attr('data-value'));
      $('.select>.placeholder').text($(this).text());
    });
  };

  // 头部下拉菜单
  Mints.headerDropMenu = function() {
    $('.header .info').hover(function() {
      $('.drop-menus').stop(true, false).slideToggle();
    });
  };

  // 全局消息提示
  Mints.globalMessage = function(type = 'error', message = '', duration = 2000) {
    $('.global-message .message').fadeIn();
    $('.global-message .message .content').addClass(type).text(message).fadeIn();
    setTimeout(function() {
      $('.global-message .message').fadeOut();
    }, duration);
  };

  // 更新验证码
  Mints.renewCaptcha = () => {
    const captcha = $('#js-captcha');
    const alert = $('#js-alert');

    captcha.on('click', () => {
      $.getJSON('/aider/captcha', res => {
        if (res.status === 1) {
          captcha.attr('src', res.url);
        } else {
          alert.text(res.message).slideDown();
          return false;
        }
      });
    });
  };

  window.Mints = Mints;
}(window, document, jQuery));
