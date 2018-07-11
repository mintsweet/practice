/* eslint-disable no-unused-vars */
function globalMessage(type, message, duration = 2000) {
  $('.message .message-notice').fadeIn();
  $('.message .message-notice .content').addClass(type).text(message).fadeIn();
  setTimeout(function() {
    $('.message .message-notice').fadeOut();
  }, duration);
}