/*
* 接口
*/
import fetch from './fetch';

// 测试接口是否可用
export const testApi = () => fetch('');
// 获取用户信息
export const getUserInfoApi = () => fetch('/user/info');
// 登录
export const signinApi = info => fetch('/user/signin', info, 'POST');
// 注册
export const signupApi = info => fetch('/user/signup', info, 'POST');