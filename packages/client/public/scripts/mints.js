function globalMessage(type = 'error', message = '', duration = 3000) {
  const html = $(`
    <div class="global-message">
      <div class="content ${type}">${message}</div>
    </div>
  `);

  $('body').append(html);
  $('body .global-message').fadeIn();

  setTimeout(function() {
    $('body .global-message').remove();
  }, duration);
}

(function(window, document, $) {
  const Mints = {};

  // 移动端菜单显示
  Mints.showMobileMenu = () => {
    const container = $('.container');
    const btn = $('.navbar');
    const menu = $('.mobile-menu');

    btn.on('click', () => {
      menu.toggleClass('open');
      btn.toggleClass('open');
      container.toggleClass('slide-left');
    });
  };

  // 话题点赞
  Mints.likeTopic = () => {
    $('#topic_like').click(function() {
      $.post(`${window.location.pathname}/like_or_un`, res => {
        const number = parseInt($(this).children('.number').text());
        if (res.status === 1) {
          if (res.action === 'like') {
            globalMessage('success', '喜欢了该话题');
            $(this).children('.number').text(number + 1);
            $(this).addClass('active');
          } else {
            globalMessage('success', '取消喜欢该话题');
            $(this).children('.number').text(number - 1);
            $(this).removeClass('active');
          }
        } else {
          globalMessage('error', res.message);
        }
      });
    });
  };

  // 话题收藏
  Mints.collectTopic = () => {
    $('#topic_collect').click(function() {
      $.post(`${window.location.pathname}/collect_or_un`, res => {
        const number = parseInt($(this).children('.number').text());
        if (res.status === 1) {
          if (res.action === 'collect') {
            globalMessage('success', '收藏了该话题');
            $(this).children('.number').text(number + 1);
            $(this).addClass('active');
          } else {
            globalMessage('success', '取消收藏该话题');
            $(this).children('.number').text(number - 1);
            $(this).removeClass('active');
          }
        } else {
          globalMessage('error', res.message);
        }
      });
    });
  };

  // 回复删除
  Mints.deleteReply = () => {
    $('#reply_delete').click(function() {
      const replyId = $(this).attr('data-id');
      $.post(`/reply/${replyId}/delete`, res => {
        if (res.status === 1) {
          globalMessage('success', '删除回复成功');
          $(this).parents('li').remove();
          $('#reply_count').text(parseInt($('#reply_count').text()) - 1);
        } else {
          globalMessage('error', '删除回复失败');
        }
      });
    });
  };

  // 回复点赞
  Mints.upReply = () => {
    $('#reply_up').click(function() {
      const rid = $(this).attr('data-id');
      $.post(`/reply/${rid}/up`, res => {
        const number = parseInt($(this).children('span').text());

        if (res.status === 1) {
          if (res.action === 'up') {
            globalMessage('success', '点赞成功');
            $(this).children('span').text(parseInt(number + 1));
          } else {
            globalMessage('success', '取消点赞成功');
            $(this).children('span').text(parseInt(number - 1));
          }
        } else {
          globalMessage('error', res.messsage);
        }
      });
    });
  };

  // 更新验证码
  Mints.renewCaptcha = () => {
    $('#js-captcha').on('click', function() {
      $.getJSON('/captcha', res => {
        if (res.status === 1) {
          $(this).attr('src', res.url);
        } else {
          globalMessage('error', res.message);
        }
      });
    });
  };

  // 关注取消关注
  Mints.followOrUn = () => {
    $('#follow_user').click(function() {
      const id = $(this).attr('data-id');
      $.post(`/user/${id}/follow_or_un`, res => {
        if (res.status === 1) {
          if (res.action === 'follow') {
            globalMessage('success', '关注成功');
            $(this).text('取消关注');
          } else {
            globalMessage('success', '取消关注');
            $(this).text('关注');
          }
        } else {
          globalMessage('error', res.message);
        }
      });
    });
  };

  window.Mints = Mints;
}(window, document, jQuery));
