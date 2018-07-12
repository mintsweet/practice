/* eslint-disable */
(function(window, document, $, undefined) {
  var Utils = {};

  // 信息页跳转
  Utils.redirect = function() {
    var time = $('#time');
    var countTime = 3;
    var url = time.attr('data-url');
    var timer;

    timer = window.setInterval(function() {
      countTime --;
      if (countTime === 0) {
        location.href = url ? url : '/';
        window.clearInterval(timer);
        return false;
      }
      time.text(countTime);
    }, 1000);
  };

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
  };

  // 模拟下拉框
  Utils.modalSelect = function() {
    $('.select').click(function() {
      $('.select>.options').slideToggle();
    });

    $('.option').click(function() {
      $('.select-hidden').val($(this).attr('data-value'));
      $('.select>.placeholder').text($(this).text());
    });
  };

  // 全局消息提示
  Utils.globalMessage = function(type, message, duration = 2000) {
    $('.message .message-notice').fadeIn();
    $('.message .message-notice .content').addClass(type).text(message).fadeIn();
    setTimeout(function() {
      $('.message .message-notice').fadeOut();
    }, duration);
  };

  // 回到顶部
  Utils.backTop = function() {
    $('.back-top').click(function() {
      $('html, body').animate({ scrollTop: 0 }, 500);
      return false;
    });
  };

  // 更新图形验证码
  Utils.updateCaptcha = function() {
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
  };

  // 头部下拉菜单
  Utils.headerDropMenu = function() {
    $('.header .info').hover(function() {
      $('.drop-menus').stop(true, false).slideToggle();
    });
  };

  // 创建话题表单校验赋值
  Utils.createTopicJS = function() {
    var simplemde = new SimpleMDE({ element: $("#editor")[0] });
    var tab = $('.select-hidden');
    var title = $('#title');
    var alert = $('.alert');

    $('#createTopic').submit(function() {
      if (!tab.val()) {
        alert.text('请选择分类').slideDown();
        return false;
      } else if (!title.val()) {
        alert.text('标题不能为空').slideDown();
        return false;
      } else if (!simplemde.value()) {
        alert.text('内容不能为空').slideDown();
        return false;
      }

      $('.content-hidden').val(simplemde.value());
    });
  };

  window.Utils = Utils;

})(window, document, jQuery);