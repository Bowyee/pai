// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


const logger = require('../config/logger');
const template = require('../models/template');

const list = (req, res) => {
  template.top(req.params.type, 10, function(err, list) {
    if (err) {
      logger.error(err);
      return res.status(500).json({
        'message': 'Failed to fetch templates from remote source.',
      });
    }
    return res.status(200).json(list);
  });
};

const search = (req, res) => {
  let query = req.query.query;
  let page = req.query.pageno ? req.query.pageno : 0;
  if (query) {
    template.filter(query, 10, page, function(err, list) {
      if (err) {
        logger.error(err);
        return res.status(500).json({
          'message': 'Failed to scan templates.',
        });
      }
      return res.status(200).json(list);
    });
  } else {
    return res.status(400).json({
      'message': 'Failed to extract "query" parameter in the request.',
    });
  }
};

module.exports = {
  list,
  search,
};