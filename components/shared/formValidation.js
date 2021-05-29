exports.isEmail = (text) => {
    let resolved = false;

    resolved = (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g.test(text));

    return resolved;
};

exports.isValidPassword = (text) => {

    let resolved = false;

    if(text.length > 6) {
        resolved = true;
    }


    return resolved;
};