import url from 'url';

const parsedQuery = (req, res, next) => {
  req.parsedQuery = url.parse(req.url, true).query;
  next();
};

export default parsedQuery;
