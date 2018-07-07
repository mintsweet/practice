const formidable = require('formidable');
const { createReply } = require('../http/api');

class Reply {
  async createReply(req, res) {
    const { tid } = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {
      if (err) {
        return res.redirect('/exception/500');
      }

      const response = await createReply(tid, fields);

      if (response.status === 1) {
        return res.redirect(`/topic/${tid}`);
      } else {
        return res.redirect('/exception/500');
      }
    });
  }
}

module.exports = new Reply();
