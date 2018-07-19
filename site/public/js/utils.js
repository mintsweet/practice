(function(window, document, $) {
  var Utils = {};

  // 回到顶部
  Utils.backTop = function() {
    $(window).scroll(function() {
      var scrollTop = $(window).scrollTop();
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
  Utils.modalSelect = function() {
    $('.select').click(function() {
      $('.select>.options').slideToggle();
    });

    $('.option').click(function() {
      $('.select-hidden').val($(this).attr('data-value'));
      $('.select>.placeholder').text($(this).text());
    });
  };

  // 头部下拉菜单
  Utils.headerDropMenu = function() {
    $('.header .info').hover(function() {
      $('.drop-menus').stop(true, false).slideToggle();
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

  // 获取短信验证码
  Utils.getSMSCode = function() {
    var getcode = $('.getcode');
    var mobile = $('#mobile');
    var piccaptcha = $('#piccaptcha');
    var countTime = 60;
    var timer;
    var alert = $('.alert');
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

  // 更新图形验证码
  Utils.renewCaptcha = function() {
    var captcha = $('.captcha');
    var alert = $('.alert');
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

  // 关注取消关注
  Utils.followOrUn = function() {
    var that = this;
    $('.action.follow').click(function() {
      $.post(`${window.location.pathname}/follow_or_un`, function(res) {
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

  // 话题点赞
  Utils.starTopic = function() {
    const that = this;
    $('.star-action').click(function() {
      $.getJSON(`${window.location.pathname}/star_or_un`, function(res) {
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
  };

  // 话题收藏
  Utils.collectTopic = function() {
    const that = this;
    $('.collect-action').click(function() {
      $.getJSON(`${window.location.pathname}/collect_or_un`, function(res) {
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

  // 回复删除
  Utils.deleteReply = function() {
    const that = this;
    $('.action.delete_reply').click(function() {
      const replyId = $(this).attr('data-id');
      $.post(`/reply/${replyId}/delete`, res => {
        if (res.status === 1) {
          that.globalMessage('success', '删除回复成功');
          console.log($(this).parents('li'));
          $(this).parents('li').remove();
        } else {
          that.globalMessage('error', '删除回复失败');
        }
      });
    });
  };

  // 回复点赞
  Utils.upReply = function() {
    $('.action.up_reply').click(function() {
      console.log('up');
    });
  };

  window.Utils = Utils;
}(window, document, jQuery));
