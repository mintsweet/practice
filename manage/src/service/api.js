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
export const getNewUserThisWeek = () => axios.get('/v2/users/new_this_week');

// 获取上周新增用户数量
export const getNewUserLastWeek = () => axios.get('/v2/users/new_last_week');

// 获取用户总数量
export const getUserTotal = () => axios.get('/v2/users/total');

// 获取用户列表
export const getUserList = query => axios.get('/v2/users/list', { params: query });

// 新增用户
export const createUser = user => axios.post('/v2/users/create', user);

// 删除用户
export const deleteUser = uid => axios.delete(`/v2/user/${uid}/delete`);

// 修改用户星标
export const starOrUnUser = uid => axios.patch(`/v2/user/${uid}/star`);

// 修改用户锁定
export const lockOrUnUser = uid => axios.patch(`/v2/user/${uid}/lock`);

// 获取本周新增话题数量
export const getNewTopicThisWeek = () => axios.get('/v2/topics/new_this_week');

// 获取上周新增话题数量
export const getNewTopicLastWeek = () => axios.get('/v2/topics/new_last_week');

// 获取话题总数量
export const getTopicTotal = () => axios.get('/v2/topics/total');

// 获取话题列表
export const getTopicList = query => axios.get('/v2/topics/list', { parmas: query });

// 删除话题
export const deleteTopic = tid => axios.delete(`/v2/topic/${tid}/delete`);

// 修改话题置顶
export const topOrUnTopic = tid => axios.patch(`/v2/topic/${tid}/top`);

// 修改话题精华
export const goodOrUnTopic = tid => axios.patch(`/v2/topic/${tid}/good`);

// 修改话题锁定
export const lockOrUnTopic = tid => axios.patch(`/v2/topic/${tid}/lock`);
