/*
* 接口
*/
import fetch from './fetch';

/* 
* 获取用户信息 
*/
export const getUserInfoApi = () => fetch('/user/info');

/*
* 登录
*/
export const signinApi = info => fetch('/user/signin', info, 'POST');

/*
* 注册
*/
export const signupApi = info => fetch('/user/signup', info, 'POST');

/*
* 忘记密码
*/
export const forgetApi = info => fetch('/user/forget', info, 'POST');

/*
* 获取验证码
*/
export const getMsgCaptchaApi = mobile => fetch('/common/msgcaptcha', mobile);

/*
* 获取头条文章列表
*/
export const getPostTopApi = () => fetch('/post/top');

/*
* 获取文章列表
*/
export const getPostListApi = () => fetch('/post/list');
