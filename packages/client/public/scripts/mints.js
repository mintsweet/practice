(function(window, document, $) {
  const Mints = {};

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
