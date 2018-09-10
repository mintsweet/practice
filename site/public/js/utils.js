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
  Utils.globalMessage = function(type = 'error', message = '', duration = 2000) {
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
    var alert = $('.alert');
    getcode.click(function() {
      var countTime = 60;
      var timer;

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

      $.getJSON(`/aider/sms_code?piccaptcha=${piccaptcha.val()}&mobile=${mobile.val()}`, function(res) {
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
      $.getJSON('/aider/captcha', function(res) {
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
    var utils = this;
    $('.action.follow_user').click(function() {
      const id = $(this).attr('data-id');
      $.post(`/user/${id}/follow_or_un`, res => {
        if (res.status === 1) {
          if (res.action === 'follow') {
            utils.globalMessage('success', '关注成功');
            $(this).text('取消关注');
          } else {
            utils.globalMessage('success', '取消关注');
            $(this).text('关注');
          }
        } else {
          utils.globalMessage('error', res.message);
        }
      });
    });
  };

  // 话题点赞
  Utils.likeTopic = function() {
    const utils = this;
    $('.action.like_topic').click(function() {
      const trigger = this;
      $.post(`${window.location.pathname}/like_or_un`, function(res) {
        if (res.status === 1) {
          if (res.action === 'like') {
            utils.globalMessage('success', '喜欢了该话题');

            $(trigger).children('.number').text(parseInt($('.action.like_topic .number').text()) + 1);
            $(trigger).addClass('active');
          } else {
            utils.globalMessage('success', '取消喜欢该话题');

            $(trigger).children('.number').text(parseInt($('.action.like_topic .number').text()) - 1);
            $(trigger).removeClass('active');
          }
        } else {
          utils.globalMessage('error', res.message);
        }
      });
    });
  };

  // 话题收藏
  Utils.collectTopic = function() {
    const utils = this;
    $('.action.collect_topic').click(function() {
      const trigger = this;
      $.post(`${window.location.pathname}/collect_or_un`, function(res) {
        if (res.status === 1) {
          if (res.action === 'collect') {
            utils.globalMessage('success', '收藏了该话题');

            $(trigger).children('.number').text(parseInt($('.action.collect_topic .number').text()) + 1);
            $(trigger).addClass('active');
          } else {
            utils.globalMessage('success', '取消收藏该话题');

            $(trigger).children('.number').text(parseInt($('.action.collect_topic .number').text()) - 1);
            $(trigger).removeClass('active');
          }
        } else {
          utils.globalMessage('error', res.message);
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
          $(this).parents('li').remove();
        } else {
          that.globalMessage('error', '删除回复失败');
        }
      });
    });
  };

  // 回复编辑
  Utils.editReply = function() {
    $('.action.edit_reply').click(function() {
      $('.reply-form.reply_reply_form').slideUp();
      $(this).siblings('.reply-form.edit_reply_form').slideToggle();
    });
  };

  // 回复点赞
  Utils.upReply = function() {
    const utils = this;
    $('.action.up_reply').click(function() {
      const rid = $(this).attr('data-id');
      const trigger = this;
      $.post(`/reply/${rid}/up`, res => {
        if (res.status === 1) {
          if (res.action === 'up') {
            utils.globalMessage('success', '点赞成功');
            $(trigger).children('span').text(parseInt($('.action.up_reply span').text() + 1));
          } else {
            utils.globalMessage('success', '取消点赞成功');
            $(trigger).children('span').text(parseInt($('.action.up_reply span').text() - 1));
          }
        } else {
          utils.globalMessage('error', res.messsage);
        }
      });
    });
  };

  // 回复回复
  Utils.replyReply = function() {
    $('.action.reply_reply').click(function() {
      $('.reply-form.edit_reply_form').slideUp();
      $(this).siblings('.reply-form.reply_reply_form').slideToggle();
    });
  };

  window.Utils = Utils;
}(window, document, jQuery));
