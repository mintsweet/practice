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
    $('.global-message .message').fadeIn();
    $('.global-message .message .content').addClass(type).text(message).fadeIn();
    setTimeout(function() {
      $('.global-message .message').fadeOut();
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

  // 用户详情JS
  Utils.userInfoJS = function() {
    var that = this;

    $('.user-gener .title>span').hover(function() {
      $('.user-gener .more').stop(true, false).fadeToggle();
    });

    $('.action.follow').click(function() {
      $.getJSON(`${location.pathname}/follow_or_un`, function(res) {
        if (res.status === 1) {
          if (res.action === 'follow') {
            $('.action.follow').text('取消关注');
            that.globalMessage('success', '关注成功');
          } else {
            $('.action.follow').text('关注');
            that.globalMessage('success', '取消关注');
          }
        } else {
          that.globalMessage('error', res.message);
        }
      });
    });
  };

  // 创建话题JS
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

  // 话题详情JS
  Utils.detailTopicJS = function() {
    const that = this;

    $('#replyForm').submit(function() {
      if (!content) {
        that.globalMessage('error', '回复内容不能为空');
        return false;
      }
    });

    $('.star-action').click(function() {
      $.getJSON(`${location.pathname}/star_or_un`, function(res) {
        if (res.status === 1) {
          if (res.action === 'star') {
            $('.star-action .number').text(parseInt($('.star-action .number').text()) + 1);
            $('.star-action').addClass('active');
          } else {
            $('.star-action .number').text(parseInt($('.star-action .number').text()) - 1);
            $('.star-action').removeClass('active');
          }
        } else {
          that.globalMessage('error', res.message);
        }
      });
    });

    $('.collect-action').click(function() {
      $.getJSON(`${location.pathname}/collect_or_un`, function(res) {
        console.log(res)
        if (res.status === 1) {
          if (res.action === 'collect') {
            $('.collect-action .number').text(parseInt($('.collect-action .number').text()) + 1);
            $('.collect-action').addClass('active');
          } else {
            $('.collect-action .number').text(parseInt($('.collect-action .number').text()) - 1);
            $('.collect-action').removeClass('active');
          }
        } else {
          that.globalMessage('error', res.message);
        }
      });
    });
  };

  // 忘记密码JS
  Utils.forgetPassJS = function() {
    var mobile = $('#mobile');
    var newPassword = $('#newPassword');
    var piccaptcha = $('#piccaptcha');
    var smscaptcha = $('#smscaptcha');
    var alert = $('.alert');

    $('#forgetForm').submit(function() {
      if (!mobile.val() || !/^1[3,5,7,8,9]\d{9}$/.test(mobile.val())) {
        alert.text('请填写正确格式的手机号').slideDown();
        return false;
      } else if (!newPassword.val() || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPassword.val())) {
        alert.text('请填写正确格式的新密码').slideDown();
        return false;
      } else if (!piccaptcha.val() || piccaptcha.val().length !== 5) {
        alert.text('请填写正确格式的图形验证码').slideDown();
        return false;
      } else if (!smscaptcha.val() || smscaptcha.val().length !== 6) {
        alert.text('请填写正确格式的手机验证码').slideDown();
        return false;
      }
    });
  };

  // 注册JS
  Utils.signupJS = function() {
    var nickname = $('#nickname');
    var mobile = $('#mobile');
    var password = $('#password');
    var piccaptcha = $('#piccaptcha');
    var smscaptcha = $('#smscaptcha');
    var alert = $('.alert');

    $('#signupForm').submit(function() {
      if (!nickname.val() || nickname.val().length > 8 || nickname.val().length < 2) {
        alert.text('请填写2-8位的昵称').slideDown();
        return false;
      } else if (!mobile.val() || !/^1[3,5,7,8,9]\d{9}$/.test(mobile.val())) {
        alert.text('请填写正确格式的手机号').slideDown();
        return false;
      } else if (!password.val() || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(password.val())) {
        alert.text('请填写6-18位数字、字母和特殊字符任意两种组合').slideDown();
        return false;
      } else if (!piccaptcha.val() || piccaptcha.val().length !== 5) {
        alert.text('请填写5位的图形验证码').slideDown();
        return false;
      } else if (!smscaptcha.val() || smscaptcha.val().length !== 6) {
        alert.text('请填写6位的手机验证码').slideDown();
        return false;
      }
    });
  };

  // 登录JS
  Utils.signinJS = function() {
    var mobile = $('#mobile');
    var piccaptcha = $('#piccaptcha');
    var alert = $('.alert');
    
    $('#signinForm').submit(function() {
      if (!mobile.val() || !(/^1[3,5,7,8,9]\d{9}$/.test(mobile.val()))) {
        alert.text('请填写正确格式的手机号').slideDown();
        return false;
      } else if (!piccaptcha.val() || piccaptcha.val().length !== 5) {
        alert.text('请填写正确格式的图形验证码').slideDown();
        return false;
      }
    });
  };

  // 修改密码JS
  Utils.updatePassJS = function() {
    var oldPass = $('#oldPass');
    var newPass = $('#newPass');
    var confimPass = $('#confimPass');
    var alert = $('.alert');

    $('#updatePassForm').submit(function() {
      if (!oldPass.val()) {
        alert.text('旧密码不能为空').slideDown();
        return false;
      } else if (!newPass.val() || !/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?].{6,18}/.test(newPass.val())) {
        alert.text('请填写6-18位数字、字母和特殊字符任意两种组合的密码').slideDown();
        return false;
      } else if (newPass.val() !== confimPass.val()) {
        alert.text('两次密码不一致').slideDown();
        return false;
      }
    });
  };

  // 更新个人资料JS
  Utils.settingJS = function() {
    var signature = $('#signature');
    var alert = $('.alert');
   
    $('#signature').submit(function() {
      if (signature.val().length > 100) {
        alert.text('签名长度不能超过100个字符').slideDown();
        return false;
      }
    });
  };

  window.Utils = Utils;

})(window, document, jQuery);