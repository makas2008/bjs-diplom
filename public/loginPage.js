'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setLoginErrorMessage(response.error)
        }
    };
    
    ApiConnector.login({password: data.password, login: data.login}, callback);
}

userForm.registerFormCallback = (data) => {
    const callback = (response) => {
        if (response.success) {
            location.reload();
        } else {
            userForm.setRegisterErrorMessage(response.error)
        }
    };
    
    ApiConnector.register({password: data.password, login: data.login}, callback);
}