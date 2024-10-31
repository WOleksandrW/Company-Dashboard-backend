const titleRegExp = /^[a-zA-Z0-9\s]*$/;
const usernameRegExp = /^[a-zA-Z0-9_]*$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export { titleRegExp, usernameRegExp, passwordRegExp };
