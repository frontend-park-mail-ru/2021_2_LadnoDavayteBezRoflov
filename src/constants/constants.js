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
    Profile: '/profile',
    NotFound: '/404',
};

/**
  * Константа, содержащая в себе id корневого элемента.
  */
export const Html = {
    Root: 'root',
    PopUp: 'popup',
};

/**
  * Константа, содержащая в себе параметры самого себя.
  */
export const SelfAddress = {
    Url: FRONTEND_ADDRESS,
    Port: FRONTEND_PORT,
};

/**
  * Константа, содержащая в себе параметры бэкенда.
  */
export const BackendAddress = {
    Url: BACKEND_ADDRESS,
    Port: BACKEND_PORT,
};

/**
  * Константа, содержащая в себе коды статусов HTTP.
  */
export const HttpStatusCodes = {
    Ok: 200,
    Created: 201,
    NotModified: 304,
    BadRequest: 400,
    Unauthorized: 401,
    InternalServerError: 500,
    Forbidden: 403,
};

/**
  * Константа, содержащая в себе константные сообщения.
  */
export const ConstantMessages = {
    NotModified: 'Вы ничего не поменяли',
    BadRequest: 'Не получилось отправить запрос',
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

    AvatarTooBig: 'Аватар не должен превышать 500 МиБ',

    BoardTitleTooLong: 'Название доски превышает 60 символов',
    BoardTitleTooShort: 'Название доски слишком короткое',
    BoardDescriptionTooLong: 'Описание доски превышает 500 символов',
    BoardDescriptionTooShort: 'Описание доски слишком короткое',
    BoardCreateErrorOnServer: 'Не удалось создать доску, попробуйте позднее',
    BoardDeleteErrorOnServer: 'Не удалось удалить доску, попробуйте позднее',
    BoardUpdateErrorOnServer: 'Не удалось обновить доску, попробуйте позднее',
    BoardNoAccess: 'Нет доступа к доске',

    CardListTitleTooShort: 'Название списка карточек слишком короткое',
    CardListTitleTooLong: 'Название списка карточек слишком длинное',
    CardListErrorOnServer: 'Не удалось создать список, попробуйте позднее',

    UnsuccessfulRequest: 'Неудачный запрос, попробуйте позднее :]',
};

export const BoardStoreConstants = {
    MinUserNameSearchLength: 3,
};
