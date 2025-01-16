"use strict";

const userForm = new UserForm();

// ---------- 1. Авторизация на сайте (sign in): ---------- 
userForm.loginFormCallback = data => {
  // { login: "oleg@demo.ru", password: "demo" } <- data
  ApiConnector.login(data, response => {
    // Варианты response:
    // {success: true, userId: 1}
    // {success: false, error: "Пользователь с логином и указанным паролем не найден"}
    response.success ? location.reload() : userForm.setLoginErrorMessage(response.error);
  });
};

// ----------  2. Регистрация на сайте (sign up): ---------- 
userForm.registerFormCallback = data => {
  ApiConnector.register(data, response => {
    response.success ? location.reload() : userForm.setRegisterErrorMessage(response.error);
  });
};
