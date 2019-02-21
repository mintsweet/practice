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
  Mints.modalSelect = () => {
    $('.select').click(function() {
      $('.select>.options').slideToggle();
    });

    $('.option').click(function() {
      $('.select-hidden').val($(this).attr('data-value'));
      $('.select>.placeholder').text($(this).text());
    });
  };

  // 头部下拉菜单
  Mints.headerDropMenu = () => {
    $('.header .right .user').hover(function() {
      $('.drop-menus').stop(true, false).slideToggle();
    });
  };

  // 全局消息提示
  Mints.globalMessage = (type = 'error', message = '', duration = 2000) => {
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

  // 关注取消关注
  Mints.followOrUn = () => {
    $('.action.follow_user').click(function() {
      const id = $(this).attr('data-id');
      $.post(`/user/${id}/follow_or_un`, res => {
        if (res.status === 1) {
          if (res.action === 'follow') {
            Mints.globalMessage('success', '关注成功');
            $(this).text('取消关注');
          } else {
            Mints.globalMessage('success', '取消关注');
            $(this).text('关注');
          }
        } else {
          Mints.globalMessage('error', res.message);
        }
      });
    });
  };

  // 话题点赞
  Mints.likeTopic = () => {
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
  Mints.collectTopic = () => {
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
  Mints.deleteReply = () => {
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
  Mints.editReply = () => {
    $('.action.edit_reply').click(function() {
      $('.reply-form.reply_reply_form').slideUp();
      $(this).siblings('.reply-form.edit_reply_form').slideToggle();
    });
  };

  // 回复点赞
  Mints.upReply = () => {
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
  Mints.replyReply = () => {
    $('.action.reply_reply').click(function() {
      $('.reply-form.edit_reply_form').slideUp();
      $(this).siblings('.reply-form.reply_reply_form').slideToggle();
    });
  };

  window.Mints = Mints;
}(window, document, jQuery));
