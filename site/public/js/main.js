$(document).ready(function () {
  // toc 固定和back top 显示
  $(window).scroll(function() {
    var tocTop = $(window).scrollTop();
    if (tocTop > 100) {
      $('.toc').addClass('toc-fixed');
      $('.back-top').fadeIn();
    } else {
      $('.toc').removeClass('toc-fixed');
      $('.back-top').fadeOut();
    }
  });

  // back top 回到顶部
  $('.back-top').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
    return false;
  });

  // select 展现
  $('.select').click(function() {
    $('.select .select-options').slideToggle();
  });

  // select option 选择
  $('.option').click(function() {
    $('.select-input').text($(this).text());
    $('.select-hidden').val($(this).attr('data-value'));
  });

  // 发送验证码
  var captcha = $('.captcha');
  captcha.click(function() {
    $.getJSON('/common/piccaptcha', function(res) {
      if (res.status === 1) {
        captcha.attr('src', res.data);
      } else {
        alert.text(res.message).slideDown();
        return false;
      }
    });
  });

  // 发送短信验证码
  var getcode = $('.getcode');
  var mobile = $('#mobile');
  var piccaptcha = $('#piccaptcha');
  var countTime = 60;
  var timer;
  getcode.click(function() {
    if ($(this).hasClass('disabled')) {
      return false;
    }

    getcode.addClass('disabled');

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
      getcode.text(`请${countTime}s后重试`);
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
});
