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
    Invite: {
        BoardPath: '/invite/board/',
        Board: '/invite/board/<accessPathBoard>',
        CardPath: '/invite/card/',
        Card: '/invite/card/<accessPathCard>',
    },
    Offline: '/offline',
};

/**
  * Константа, содержащая в себе id корневого элемента.
  */
export const Html = {
    Root: 'root',
    PopUp: 'popup',
};

/**
  * Константа, содержащая в себе параметры URL
  */
export const HTTP = {
    SelfAddress: {
        Url: FRONTEND_ADDRESS,
        Port: FRONTEND_PORT,
    },
    BackendAddress: {
        Url: BACKEND_ADDRESS,
        Port: BACKEND_PORT,
    },
    Scheme: SCHEME,
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
    TooLarge: 413,
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

    AvatarTooBig: 'Аватар не должен превышать 500 КБ',

    TeamTitleTooLong: 'Название команды превышает 60 символов',
    TeamTitleTooShort: 'Название команды слишком короткое',

    BoardTitleTooLong: 'Название доски превышает 60 символов',
    BoardTitleTooShort: 'Название доски слишком короткое',
    BoardDescriptionTooLong: 'Описание доски превышает 500 символов',
    BoardDescriptionTooShort: 'Описание доски слишком короткое',
    BoardCreateErrorOnServer: 'Не удалось создать доску, попробуйте позднее',
    BoardDeleteErrorOnServer: 'Не удалось удалить доску, попробуйте позднее',
    BoardUpdateErrorOnServer: 'Не удалось обновить доску, попробуйте позднее',
    BoardNoAccess: 'Нет доступа к доске',

    CardListTitleTooShort: 'Название колонки слишком короткое',
    CardListTitleTooLong: 'Название колонки слишком длинное',
    CardListErrorOnServer: 'Не удалось создать колонку, попробуйте позднее',

    CardTitleTooShort: 'Название карточки слишком короткое',
    CardTitleTooLong: 'Название карточки слишком длинное',
    CardErrorOnServer: 'Не удалось создать карточку, попробуйте позднее',
    UnsuccessfulRequest: 'Неудачный запрос, попробуйте позднее :]',
    AttachmentSizeTooBig: 'Слишком большой размер вложения',
    CantCopyToClipBoard: 'Не удалось скопировать текст',

    WrongTagNameLength: 'Введите имя тега длиной от 1 до 40 символов',

    OfflineMessage: 'Операция не удалась - отсутствует соединение с Интернетом',
    TooLargeMessage: 'Файл фложения слишком большой',
};

export const BoardStoreConstants = {
    MinUserNameSearchLength: 3,
    MaxAttachmentSize: 1024 * 1024 * 50,
};

export const CheckLists = {
    CheckListDefaultTitle: 'Check List',
    CheckListItemDefaultTitle: 'Item',
};

export const SettingStoreConstants = {
    MobileNavWidth: 500,
};

export const ServiceWorker = {
    CacheUrls: {
        HTML_URL: '/index.html',
        OFFLINE_URL: '/offline',
        NO_INTERNET_IMG_URL: '/assets/no-internet-icon.webp',
    },
    API_PREFIX: '/api',
    STATIC_CACHE_NAME: `static-cache-${APP_VERSION}`,
    API_CACHE_NAME: `api-cache-${APP_VERSION}`,
    ATTACHMENT_PREFIX: '/attach',
    ATTACH_NAME_PARAM: 'file_name',
    SW_HEADER: 'X-Is-From-Service-Worker',
    Messages: {
        OFFLINE_FROM_CACHE: 'offline-cache', // Приложение работает в offline
        OFFLINE_NO_CACHE: 'offline-no-cache', // Приложение offline и дальше не может работать
        ONLINE: 'online', // Приложение online
    },
};
