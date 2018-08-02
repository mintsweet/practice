import axios from 'axios';

axios.defaults.baseURL = '/api';

axios.interceptors.response.use((res) => {
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
export const getUserInfo = token => axios.get('/v1/info', { headers: { 'Authorization': token } });
