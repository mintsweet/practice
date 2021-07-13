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

$(document).ready(function() {
  // 回到顶部按钮显示
  $(window).scroll(function() {
    const scrollTop = $(window).scrollTop();
    if (scrollTop > 100) {
      $('.back-top').fadeIn();
    } else {
      $('.back-top').fadeOut();
    }
  });

  // 回到顶部
  $('.back-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 300);
    return false;
  });

  // 移动端菜单显示
  $('.navbar').on('click', () => {
    $('.mobile-menu').toggleClass('open');
    $(this).toggleClass('open');
    $('.container').toggleClass('slide-left');
  });

  // 更新验证码
  $('#js-captcha').on('click', function() {
    $.getJSON('/captcha', res => {
      if (res.status === 1) {
        $(this).attr('src', res.url);
      } else {
        globalMessage('error', res.message);
      }
    });
  });

  // 用户关注
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

  // 话题点赞
  $('#topic_like').click(function() {
    const id = $(this).attr('data-id');
    $.post(`/topic/${id}/like`, res => {
      const number = parseInt(
        $(this)
          .children('.number')
          .text(),
      );
      if (res.status === 1) {
        if (res.action === 'like') {
          globalMessage('success', '喜欢了该话题');
          $(this)
            .children('.number')
            .text(number + 1);
          $(this).addClass('active');
        } else {
          globalMessage('success', '取消喜欢该话题');
          $(this)
            .children('.number')
            .text(number - 1);
          $(this).removeClass('active');
        }
      } else {
        globalMessage('error', res.message);
      }
    });
  });

  // 话题收藏
  $('#topic_collect').click(function() {
    $.post(`${window.location.pathname}/collect_or_un`, res => {
      const number = parseInt(
        $(this)
          .children('.number')
          .text(),
      );
      if (res.status === 1) {
        if (res.action === 'collect') {
          globalMessage('success', '收藏了该话题');
          $(this)
            .children('.number')
            .text(number + 1);
          $(this).addClass('active');
        } else {
          globalMessage('success', '取消收藏该话题');
          $(this)
            .children('.number')
            .text(number - 1);
          $(this).removeClass('active');
        }
      } else {
        globalMessage('error', res.message);
      }
    });
  });

  // 回复点赞
  $('#reply_up').click(function() {
    const rid = $(this).attr('data-id');
    $.post(`/reply/${rid}/up`, res => {
      const number = parseInt(
        $(this)
          .children('span')
          .text(),
      );

      if (res.status === 1) {
        if (res.action === 'up') {
          globalMessage('success', '点赞成功');
          $(this)
            .children('span')
            .text(parseInt(number + 1));
        } else {
          globalMessage('success', '取消点赞成功');
          $(this)
            .children('span')
            .text(parseInt(number - 1));
        }
      } else {
        globalMessage('error', res.messsage);
      }
    });
  });
});
