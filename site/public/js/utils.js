/* eslint-disable */
function globalMessage(type, message, duration = 2000) {
  $('.message .message-notice').fadeIn();
  $('.message .message-notice .content').addClass(type).text(message).fadeIn();
  setTimeout(function() {
    $('.message .message-notice').fadeOut();
  }, duration);
}

(function(window, document, $, undefined) {
  var Utils = {};

  // 信息页跳转
  Utils.redirect = function() {
    var time = $('#time'),
        countTime = 3,
        url = time.attr('data-url'),
        timer;

    timer = window.setInterval(function() {
      countTime --;
      if (countTime === 0) {
        location.href = url ? url : '/';
        window.clearInterval(timer);
        return false;
      }
      time.text(countTime);
    }, 1000);
  }

  // 获取短信验证码
  Utils.getSMSCode = function() {
    console.log(1);
    var getcode = $('.getcode');
    var mobile = $('#mobile');
    var piccaptcha = $('#piccaptcha');
    var countTime = 60;
    var timer;
    getcode.click(function() {
      if ($(this).hasClass('disabled')) {
        return false;
      }

      if (!mobile.val() || !/^1[3,5,7,8,9]\d{9}$/.test(mobile.val())) {
        alert.text('请填写正确的手机号').slideDown();
        return false;
      }

      if (!piccaptcha.val() || piccaptcha.val().length !== 5) {
        alert.text('请填写正确格式的图形验证码').slideDown();
        return false;
      }

      function countStats() {
        countTime--;
        getcode.addClass('disabled').text(`请${countTime}s后重试`);
        if (countTime === 0) {
          getcode.removeClass('disabled').text('获取验证码');
          clearInterval(timer);
          return false;
        }
      }

      $.getJSON(`/captcha/sms?piccaptcha=${piccaptcha.val()}&mobile=${mobile.val()}`, function(res) {
        if (res.status === 1) {
          timer = setInterval(countStats, 1000);
        } else {
          alert.text(res.message).slideDown();
          return false;
        }
      });
    });
  }

  window.Utils = Utils;

})(window, document, jQuery);