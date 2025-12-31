module.exports.normalize = (str = "") =>
  str.replace(/\r\n/g, "\n").trim();
