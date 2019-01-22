const fs = require('fs');
const path = require('path');
const md2html = require('../../utils/md2html');

test('md2html correctly called', () => {
  const apiDoc = fs.readFileSync(path.join(__dirname, '../../../../docs/API.md'), 'utf8');
  const normsDoc = fs.readFileSync(path.join(__dirname, '../../assets/norms.md'), 'utf8');

  const apiHtml = md2html(apiDoc);
  const normsHtml = md2html(normsDoc);

  expect(apiHtml).toContain('API文档');
  expect(normsHtml).toContain('关于薄荷糖社区(Mints)社区规范');
});
