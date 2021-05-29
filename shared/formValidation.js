const { isEmail } = require("../components/shared/formValidation");

module.exports.isEmail = (email) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
};

module.exports.isValidPassword = (password) => {
    return password.length > 6;
};