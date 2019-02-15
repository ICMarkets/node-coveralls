var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var index = require('../index');
var logger = require('./logger')();
var fetchGitData = require('./fetchGitData');

var getBaseOptions = function(cb){
  var options = {};

  var match = (process.env.CI_PULL_REQUEST || "").match(/(\d+)$/);

  if (match) {
    options.service_pull_request = match[1];
  }

  options.service_name = 'Docker';
  options.git = {};
  options.git.head = {};
  options.git.head.author_name = "team";
  options.git.head.author_email = "";
  options.git.head.committer_name = "Unknown Committer";
  options.git.head.committer_email = "";
  options.git.head.message = "Unknown Commit Message";
  options.git.branch = process.env.CI_BRANCH;

  return cb(null, options);
};

var getOptions = function(cb, _userOptions){
  if (!cb){
    throw new Error('getOptions requires a callback');
  }

  var userOptions = _userOptions || {};

  getBaseOptions(function(err, options){
    // minimist populates options._ with non-option command line arguments
    var firstNonOptionArgument = index.options._[0];

    if (firstNonOptionArgument)
      options.filepath = firstNonOptionArgument;

    // lodash or else would be better, but no need for the extra dependency
    for (var option in userOptions) {
      options[option] = userOptions[option];
    }
    cb(err, options);
  });
};

module.exports.getBaseOptions = getBaseOptions;
module.exports.getOptions = getOptions;
