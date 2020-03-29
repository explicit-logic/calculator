const Ajv = require('ajv');
const fs = require('fs');
const loaderUtils = require('loader-utils');
// const validateOptions = require('schema-utils');

module.exports = function (content) {
  // const options = loaderUtils.getOptions(this);
  const schemaPath = loaderUtils.interpolateName(this, '[path]schema/[name].[ext]', {
    content,
  });

  const callback = this.async();
  this.addDependency(schemaPath);

  fs.readFile(schemaPath, 'utf-8', (err, schemaFile) => {
    if (err) return callback(err);

    const schema = JSON.parse(schemaFile);
    const ajv = new Ajv();
    const isValid = ajv.validate(schema, JSON.parse(content));
    if (!isValid) {
      // console.log(ajv.errors);
      return callback(new Error(ajv.errorsText()));
    }

    return callback(null, content);
  });
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  // const schema = require(url);
};
