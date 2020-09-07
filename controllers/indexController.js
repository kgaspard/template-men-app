
const config = require('config')

exports.index_page_get = (req, res, next) => {
  res.render('index', { title: config.get('app.name') });
};