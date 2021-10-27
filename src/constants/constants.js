'use strict';

/**
  * Константа, содержащая в себе urlы.
  */
export const Urls = {
    Root: '/',
    Boards: '/boards',
    Login: '/login',
    Register: '/register',
    Board: '/board/<id>',
    Card: '/card/<id>',
    NotFound: '/404',
};

/**
  * Константа, содержащая в себе id корневого элемента.
  */
export const Html = {
    Root: 'root',
};

/**
  * Константа, содержащая в себе параметры самого себя.
  */
export const SelfAddress = {
    Url: 'localhost',
    Port: '3000',
};

/**
  * Константа, содержащая в себе параметры бэкенда.
  */
export const BackendAddress = {
    Url: 'localhost',
    Port: '8000',
};

/**
  * Константа, содержащая в себе коды статусов HTTP.
  */
export const HttpStatusCodes = {
    Ok: 200,
    Created: 201,
    Unauthorized: 401,
    InternalServerError: 500,
};

/**
  * Константа, содержащая в себе константные сообщения.
  */
export const ConstantMessages = {
    WrongCredentials: 'Неверный логин или пароль',
    UnableToLogin: 'Не получилось войти',
    UnableToRegister: 'Не получилось зарегистрироваться',
    NonMatchingPasswords: 'Пароли не совпадают',

    EnterCorrectEmail: 'Введите корректный e-mail',

    WrongLoginLength: 'Введите логин длиной от 3 до 20 символов',
    UseOnlyLatinLettersLogin: 'Введите логин, содержащий только латинские буквы',

    WrongPasswordLength: 'Введите пароль длиной от 6 до 25 символов',
    NotBeginningWithNumberPassword: 'Введите пароль, не начинающийся с цифры',
    NoSpecialSymbolsPassword: 'Введите пароль, не содержащий специальных символов',
    UseOnlyLatinLettersPassword: 'Введите пароль, содержащий только латинские буквы',


};
