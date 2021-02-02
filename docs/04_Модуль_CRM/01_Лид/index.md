# Описание сущности

Лид - это любая минимальная информация о намерении получить услугу/товар. Заполнение формы обратной связи, входящий звонок, письпо полученное на почтовый ящик - это намерение купить товар/приобрести услугу.

# Поля лидов

В таблице указаны основные поля непосредственной сущности Лид.

| Поле | Тип |     Описание                                    | Примечание |
| :--- | --- | ----------------------------------------------- | ---------- |
| ID   | int | Уникальный целочисленный идентификатор лида     | ``AI``, ``RO`` |
| TITLE | string | Название лида                                 | ``REQ`` |
| HONORIFIC | crm_status | Обращение | Код справочника: HONORIFIC |
| NAME | string | Имя ||
| SECOND_NAME | string | Отчество ||
| LAST_NAME | string | Фамилия ||
| BIRTHDATE | date | Дата рождения ||
| BIRTHDAY_SORT | integer | Универсальное число, получаемое из даты рождения для сортировки и поиска ||
| COMPANY_TITLE | string | Название компании ||
| SOURCE_ID | crm_status | Источник | Код справочника: SOURCE |
| SOURCE_DESCRIPTION | string | Дополнительно об источнике ||
| STATUS_ID | crm_status | Статус | Код справочника: STATUS |
| STATUS_DESCRIPTION | string | Дополнительно о статусе ||
| STATUS_SEMANTIC_ID | string | Состояние статуса (N (новый), P (в работе), F (закрыт)) | ``RO``|
| POST | string | Должность ||
| CURRENCY_ID | crm_currency | Валюта ||
| OPPORTUNITY | double | Сумма ||
| OPENED | char | Доступен для всех | Y/N |
| COMMENTS | string | Комментарий ||
| HAS_PHONE | char | Задан телефон, автоматически вычисляется при создании/обновлении | Y/N, ``RO`` |
| HAS_EMAIL | char | Задан e-mail, автоматически вычисляется при создании/обновлении | Y/N, ``RO`` |
| HAS_IMOL | char | Задана открытая линия, автоматически вычисляется при создании/обновлении | Y/N, ``RO`` |
| ASSIGNED_BY_ID | user | Ответственный ||
| CREATED_BY_ID | user | Кем создан | ``RO`` |
| MODIFY_BY_ID | user | Кем изменен | ``RO`` |
| DATE_CREATE | datetime | Дата создания | ``RO`` |
| DATE_MODIFY | datetime | Дата изменения | ``RO`` |
| COMPANY_ID | crm_company | Компания ||
| CONTACT_ID | crm_contact | Контакт | ``DEP`` |
| IS_RETURN_CUSTOMER | char | Повторный лид | Y/N, ``RO`` |
| DATE_CLOSED | datetime | Дата завершения | ``RO` |
| ORIGINATOR_ID | string | Внешний источник ||
| ORIGIN_ID | string | Идентификатор элемента во внешнем источнике ||
| UTM_SOURCE | string | Рекламная система ||
| UTM_MEDIUM | string | Тип трафика ||
| UTM_CAMPAIGN | string | Обозначение рекламной кампании ||
| UTM_CONTENT | string | Содержание кампании ||
| UTM_TERM | string | Условие поиска кампании ||
| PHONE | crm_multifield | Телефон | ``RO`` |
| EMAIL | crm_multifield | E-mail | ``RO`` |
| WEB | crm_multifield | Сайт | ``RO`` |
| IM | crm_multifield | Мессенджер | ``RO`` |

Примечание к полям: 

1. Для улучшения восприятия, в таблице используются следующие виртуальные типы:
* user - целочисленный идентификатор, указывающий что в данном поле хранится ID пользователя
* crm_status - символьный идентификатор, указывающий что в данном поле хранится симв. код из таблицы справочников (b_crm_status)
* date, datetime - передаются в формате сайта
* crm_company - целочисленный идентификатор, указывающий что в данном поле хранится ID компании
* crm_contact - целочисленный идентификатор, указывающий что в данном поле хранится ID контакта
* crm_multifield - комплексная структура описывающая множественные поля
    
2. Для обозначения специальных полей используются дополнительные флаги:
* ``RO`` - read only (поле только для чтения)
* ``AI`` - auto increment (автоматически заполняемый счетчик, наследует поведение ``RO``)
* ``REQ`` - required (обязательное)
* ``DEP`` - deprecated (устаревшее). Не следует ориентироваться на данные поля, так как они могут быть удалены или их поведение было изменено

3. Не следует использовать поля ORIGINATOR_ID и ORIGIN_ID для хранения внешних ключей при синхронизации. Эти поля заполняются исключительно при создании из внешних систем.

Полный перечень полей, можно получить обратившись к соответствующим методам изложенными ниже.

# Основные методы работы

## Получение списка полей

Лид это комплексная структура состоящая из нескольких составных частей: основные данные, множественные поля, пользовательские поля.

Получить большую часть модей, можно через php код:
```php
use \Bitrix\Main;

global $USER_FIELD_MANAGER;

if ( \Bitrix\Main\Loader::IncludeModule('crm') )
{
    $fieldsInfo = \CCrmLead::GetFieldsInfo();

    $typesID = array_keys( \CCrmFieldMulti::GetEntityTypeInfos() );
    foreach($typesID as $typeID)
    {
        $fieldsInfo[$typeID] = [
            'TYPE' => 'crm_multifield',
            'ATTRIBUTES' => [\CCrmFieldInfoAttr::Multiple]
        ];
    }

    foreach ($fieldsInfo as $code => &$field)
    {
        $field['CAPTION'] = \CCrmLead::GetFieldCaption($code);
    }

    $userType = new \CCrmUserType(
        $USER_FIELD_MANAGER,
        \CCrmLead::$sUFEntityID
    );
    $userType->PrepareFieldsInfo($fieldsInfo);

    /**
     * Lead fields
     * @array
     */
    var_dump($fieldsInfo);
}
```

Однако следует учитывать некоторые разночтения после начала ввода новой архитектуры D7, в систему были добавлены DataManager'ы, которые в свою очередь имеют свой допустимый перечень полей. Можно посмотреть их в ```\Bitrix\Crm\LeadTable::getMap()```

## Получение списка лидов

Существует несколько способов получить перечень лидов из системы: старое API и DataManager. Каждый способ имеет свои преимущества и не достатки, что в конечном счете использовать должен выбрать разработчик.

| Сравнение                          |Старое API|DataManager|
| :--------------------------------: | -------- | --------- |
| Возможность получить данные из БД  | v | v |
| Учет прав при получении            | v | x |
| Простая фильтрация данных          | v | v |
| Использование подзапросов для сложной фильтрации | x | v |

Резюмируя, в случае DataManager как преимущество можно выделить скорость работы и гибкость за счет трансляции кода в SQL запрос, в то время как использование старого api дает возможность использовать проверку прав.

### Используя старое API

Для получение лидов используя старое API используется метод ```CCrmLead::GetListEx``.  

Сигнатура метода: 
```php
$leadResult = CCrmLead::GetListEx(
    $arOrder  = array(),
    $arFilter = array(),
    $arGroupBy = false,
    $arNavStartParams = false,
    $arSelectFields = array(),
    $arOptions = array()
);
```

Механизм получения данных аналогичен [выборке из инфоблоков](http://dev.1c-bitrix.ru/api_help/iblock/classes/ciblockelement/getlist.php). По-умолчанию при выборке проверяются права текущего пользователя, поэтому чтобы получить все значения без проверки прав необходимо передать в фильтре флаг ``CHECK_PERMISSIONS`` с значением ``N``.

Пример: необходимо получить названия и ID лидов, которые созданные 1 января 2021 года без учета прав пользователя, отсортированные по источнику (убыванию)

```php
$leadResult = CCrmLead::GetListEx(
    [
        'SOURCE_ID' => 'DESC'
    ],
    [
        '><DATE_CREATE' => [
            '01.01.2021 00:00:00',
            '01.01.2021 23:59:59'
        ],
        'CHECK_PERMISSIONS' => 'N'
    ],
    false,
    false,
    [
        'ID',
        'TITLE'
    ]
);

while( $lead = $leadResult->fetch() )
{
    /**
     * [ 'ID' => ..., 'TITLE' => ... ]
     * @var array
     */
    var_dump($lead);
    var_dump($lead['ID']);
}
```

### Используя DataManager

Для получения лидов через DataManager используется класс ```\Bitrix\Crm\LeadTable``` который является представлением для таблицы b_crm_lead. Для получения данных используется универсальный метод, который хорошо [описан в документации](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=43&LESSON_ID=5753).

Примечание: реализация DataManager архитектурно отличается от старого API, поэтому перечень полей для лидов старого и нового API может разниться. Актуальный список уже доступных полей можно найти получить из метода getMap(), а так же используя класс CCrmUserType (см. "Получение списка полей").

Рассмотрим пример из старого лида в реализации DataManager.

```php
use \Bitrix\Crm;

$leadResult = Crm\LeadTable::getList([
    'select' => [
        'ID',
        'TITLE'
    ],
    'filter' => [
        '><DATE_CREATE' => [
            new \Bitrix\Main\Type\DateTime('01.01.2021 00:00:00'),
            new \Bitrix\Main\Type\DateTime('01.01.2021 23:59:59')
        ]
    ],
    'order' => [
        'SOURCE_ID' => 'DESC'
    ]
]);

foreach ($leadResult as $lead)
{
    /**
     * [ 'ID' => ..., 'TITLE' => ... ]
     * @var array
     */
    var_dump($lead);
    var_dump($lead['ID']);
}
```

## Создание лида

Добавиление лида производится нестатическим методом Add класса CCrmLead. 
Сигнатура метода:

```php
public function Add(array &$arFields, $bUpdateSearch = true, $options = array())
```

Общий процесс добавления лида:
1. Проверка прав на добавление
2. Проверка обязательных полей
3. Подготовка технических полей
4. Вызов события OnBeforeCrmLeadAdd.
5. Запись лида в таблицу
6. Расчет прав
7. Сохранение связанных сущностей
8. Создание сообщения в ленту (по-умолчанию - да)
9. Вызов события OnAfterCrmLeadAdd
10. При наличии ORIGIN_ID вызов события OnAfterExternalCrmLeadAdd
11. Push обновление kanban

Технически, лид не является простой сущностью и состоит из нескольких структур: 
* Общие данные
* Множественные поля
* Наблюдатели
* Адреса
* Связанные контакты

Однако на практике, не имеет смысла разделять их между собой.
Ниже представлен код иллюстрирующий добавление лида.

```php
/**
 * true, если нужно проверять права текущего пользователя.
 * Текущий пользователь определяется ID в ключе CURRENT_USER
 * $arOptions
 * @var boolean
 */
$bCheckRight = true;

/**
 * Поля добавляемого лида
 * @var array
 */
$leadFields = [
    // Основные поля
    'TITLE'    => 'Андрей - Форма обратной связи',
    'NAME'     => 'Андрей',
    "COMMENTS" => "Текст который Андрей ввел в форму обратной связи",
    "FM"       => [
        "PHONE" => [
            "n0" => [
                "VALUE"      => '+78889996644',
                "VALUE_TYPE" => "WORK",
            ],
            "n1" => [
                "VALUE"      => '+7 (495) 888-66-44',
                "VALUE_TYPE" => "HOME",
            ]
        ],
        "EMAIL" => [
            "n0" => [
                "VALUE"      => 'some@email.com',
                "VALUE_TYPE" => "WORK",
            ],
        ],
    ],

    // Технические поля
    "OPENED" => "Y", // "Доступен для всех" = Да
    "OBSERVER_IDS" => [
        1 // Добавим в наблюдателей - администратора
    ],
    "ASSIGNED_BY_ID" => 123, // По-умолчанию ответственным будет пользователь с ID:123

    // Поля для маркетинга
    'SOURCE_ID' => 'WEB',
    'SOURCE_DESCRIPTION' => 'Пришел с dev.1c-bitrix.ru', 
];


$leadEntity = new \CCrmLead( $bCheckRight );

$leadId = $leadEntity->Add(
    $leadFields,
    $bUpdateSearch = true,
    $arOptions = [
        /**
         * ID пользователя, от лица которого выполняется действие
         * в том числе проверка прав
         * @var integer
         */
        'CURRENT_USER' => \CCrmSecurityHelper::GetCurrentUserID(),

        /**
         * Устанавливайте флаг, только если сущность проходит
         * процедуру восстановления. В случае если флаг есть
         * можно заполнять технические поля DATE_CREATE, DATE_MODIFY
         * @var boolean
         */
        // 'IS_RESTORATION' => true,

        /**
         * В случае если флаг true при добавлении лида не будут проверяться:
         * - Поля обязательные со стадии
         * - Валидация пользовательских полей
         * @var boolean
         */
        'DISABLE_USER_FIELD_CHECK' => false,

        /**
         * В случае если флаг имеет значение true, а флаг 
         * DISABLE_USER_FIELD_CHECK не определен или false
         * не будет проверять обязательность полей со стадии, но 
         * не отменяет валидацию пользовательских полей
         */
        'DISABLE_REQUIRED_USER_FIELD_CHECK' => false,
    ]
);

if ( !$leadId )
{
    /**
     * Произошла ошибка при добавлении лида, посмотреть ее можно
     * через любой из способов ниже:
     * 1. $leadFields['RESULT_MESSAGE']
     * 2. $leadEntity->LAST_ERROR
     */
}
```

## Обновление лида


CURRENT_FIELDS


## Удаление лида

Удаление лидов в системе осуществляется исключительно по ID.

Общий процесс удаления лида:
1. Проверка существования лида 
2. Вызов события OnBeforeCrmLeadDelete.
3. Удаление лида
4. Очистка связанных данных
5. Вызов события OnAfterCrmLeadDelete

За удаление отвечает нестатический метод Delete класса CCrmLead, который имеет следующую сигнатуру: 

```php
public function Delete($ID, $arOptions = array()): bool
```

Полное описание метода удаления на примере лида с идентификатором 123:
```php

/**
 * Идентификатор лида для удаления
 * @var integer
 */
$entityId = 123;

/**
 * true, если нужно проверять права текущего пользователя.
 * Текущий пользователь определяется ID в ключе CURRENT_USER
 * $arOptions
 * @var boolean
 */
$bCheckRight = true;

$leadEntity = new \CCrmLead( $bCheckRight );

$deleteResult = $leadEntity->Delete(
    $entityId,
    [
        /**
         * ID пользователя, от лица которого выполняется операция
         * Значение по-умолчанию: ID текущего пользователя
         * @var int
         */
        'CURRENT_USER' => \CCrmSecurityHelper::GetCurrentUserID(),

        /**
         * Удалить связанные бизнес-процессы
         * Значение по-умолчанию: true
         * @var boolean
         */
        'PROCESS_BIZPROC' => true,

        /**
         * Включить отложенное удаление 
         * Значение по-умолчанию хранится в методе \Bitrix\Crm\Settings\LeadSettings::getCurrent()->isDeferredCleaningEnabled()
         * @var boolean
         */
        'ENABLE_DEFERRED_MODE' => \Bitrix\Crm\Settings\LeadSettings::getCurrent()->isDeferredCleaningEnabled()

        /**
         * Пометить кеш дубликатов не актуальным
         * Значение по-умолчанию: true
         * @var boolean
         */
        'ENABLE_DUP_INDEX_INVALIDATION' => true,
    ]
);

if ( !$deleteResult )
{
    // Операция не удалась
    var_dump($entity->LAST_ERROR);
}
```

Это излишнее описание с указанием значений по-умолчанию. В большинстве случае достаточно будет использовать упрощенную форму: 

```php
/**
 * Идентификатор лида для удаления
 * @var integer
 */
$entityId = 123;

/**
 * Идентификатор пользователя, чье имя нужно занести в историю
 * @var integer
 */
$logHistoryUserId = \CCrmSecurityHelper::GetCurrentUserID();

$leadEntity = new \CCrmLead( false );

$deleteResult = $leadEntity->Delete(
    $entityId,
    [
        'CURRENT_USER' => $logHistoryUserId,
    ]
);

if ( !$deleteResult )
{
    // Операция не удалась
    var_dump($entity->LAST_ERROR);
}
```