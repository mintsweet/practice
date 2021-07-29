/**
 * 时间范围查询参数处理
 */
exports.formatRangeTime = (query, keys) => {
  const result = {};
  keys.forEach(key => {
    if (query[key]) {
      const rangeTime = JSON.parse(query[key]);
      result[key] = {
        $gte: new Date(rangeTime[0]),
        $lte: new Date(rangeTime[1]),
      };
    }
  });
  return {
    ...query,
    ...result,
  };
};

/**
 * 模糊查询参数处理
 */
exports.formatFuzzy = (query, keys) => {
  const result = {};
  keys.forEach(key => {
    if (query[key]) {
      result[key] = {
        $regex: query[key],
      };
    }
  });
  return {
    ...query,
    ...result,
  };
};
