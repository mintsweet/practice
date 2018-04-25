import fetch from './fetch';
/*
* 接口
*/
// 登录
export const signinApi = info => fetch('/user/signin', info, 'POST');

// 注册
export const signupApi = info => fetch('/user/signup', info, 'POST');
