import FormGenerator from './generator';
// import FormValidator from './validator';
import forms from './forms';

const formRegisterElement = document.querySelector('#form-register');
const formRegister = new FormGenerator(formRegisterElement, forms.register);
formRegister.build();

const formLoginElement = document.querySelector('#form-login');
const formLogin = new FormGenerator(formLoginElement, forms.login);
formLogin.build();
