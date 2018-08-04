import axios from 'axios';

axios.defaults.baseURL = '/api';

axios.interceptors.response.use(res => {
  return res.data;
}, (err) => {
  return Promise.reject(err.response.data);
});

// 获取短信验证码
export const getSMSCode = mobile => axios.get('/v1/aider/sms_code', { params: mobile });

// 登录
export const signin = user => axios.post('/v1/signin', user);

// 忘记密码
export const forgetPass = user => axios.patch('/v1/forget_pass', user);

// 获取当前登录用户信息
export const getUserInfo = () => axios.get('/v1/info');

// 获取本周新增用户数量
export const getNewUserThisWeek = () => axios.get('/v2/user/new_this_week');

// 获取上周新增用户数量
export const getNewUserLastWeek = () => axios.get('/v2/user/new_last_week');

// 获取用户总数量
export const getUserTotal = () => axios.get('/v2/user/total');

// 获取本周新增话题数量
export const getNewTopicThisWeek = () => axios.get('/v2/topic/new_this_week');

// 获取上周新增话题数量
export const getNewTopicLastWeek = () => axios.get('/v2/topic/new_last_week');

// 获取话题总数量
export const getTopicTotal = () => axios.get('/v2/topic/total');
