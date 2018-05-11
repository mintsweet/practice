import BaseComponent from '../prototype/baseComponent';
import StatisticsModel from '../models/statistics';

class Statistic extends BaseComponent {
	constructor(){
		super()
		this.recordApi = this.recordApi.bind(this);
  }
  
	async recordApi(req, res, next) {
		try {
			const statistics_id = await this.getId('statistics_id');
			const info = {
        id: statistics_id,
        origin: req.header.origin
			};
			StatisticsModel.create(info);
		} catch(err) {
			console.log('API记录出错', err);
		}
		next();
	}
}