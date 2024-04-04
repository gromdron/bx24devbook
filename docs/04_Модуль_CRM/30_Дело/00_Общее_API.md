# Общее апи

Здесь будет описано общее апи по работе с делами, в том числе устаревшими.


## Удаление дела

За удаление дела отвечает статический метод `Delete` класса `CCrmActivity`.
Метод имеет следующую сигнатуру:

```\CCrmActivity::Delete($ID, $checkPerms = true, $regEvent = true, $options = array()): bool```

Описание полей:
- `ID` - идентификатор удаляемого дела
- `$checkPerms` - флаг, отвечающий за подключение механизма проверки прав
- `$regEvent` - флаг, нужна ли регистрация в истории сущности
- `$options` - массив дополнительных параметров для работы метода

В качестве дополнительных параметров, можно передать:
- `MOVED_TO_RECYCLE_BIN` (bool) - флаг того что происходит не удаление, а перемещение в корзину.
- `ACTUAL_ITEM` - массив описания удаляемого дела (если передан, то убирает лишний запрос в базу данных). Если передан и не является массивом или найти объект в базе не удалось - удаление будет прекращено.
- `ACTUAL_BINDINGS` - массив из наборов текущих связей дела с crm-сущностями. Если не передан, будет запрошен из базы данных. 
- `SKIP_BINDINGS` (bool) - флаг, отключающий удаление связей удаляемого дела с crm-сущностями.
- `SKIP_COMMUNICATIONS` (bool) - флаг, отключающий удаление привязанных к делу коммуникационных каналов.
- `SKIP_FILES` (bool) - флаг, отключающий удаление привязанных к делу файлов. Если `MOVED_TO_RECYCLE_BIN` = `true`, автоматически `true`.
- `SKIP_USER_ACTIVITY_SYNC` (bool) - флаг отключающий синхронизацию активности (не будет перерасчета ближайших дел)
- `SKIP_STATISTICS` (bool) - флаг, отключающий перерасчет статистики сделки/лида
- `SKIP_ASSOCIATED_ENTITY` (bool) - флаг, отключающий удаление связанной сущности (связанную сущность определяет провайдер дела)
- `SKIP_CALENDAR_EVENT` (bool) - флаг, отключающий удаление события календаря связанного с этим делом (если такое существует)

Пример простого удаления дела с ID:123
```php
$activityId = 123;

$isDeleted = \CCrmActivity::Delete($activityId);

if ( !$isDeleted )
{
	// Not deleted
	var_dump(\CCrmActivity::GetErrorMessages());
}
else
{
	// Deleted
}
```

### События метода

#### OnBeforeActivityDelete

Событие вызываемое перед удалением (или перемещением в корзину) элемента методом `CCrmActivity::Delete`.
 
| Параметр | Значение                      |
|:--------:|-------------------------------|
|   $id    | Идентификатор удаляемого дела |

Если вернет `false` (строгая проверка) может прекратить удаление дела.

Пример обработчика события, запрещающего удалять дело:
```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandlerCompatible(
    'crm',
    'OnBeforeActivityDelete',
    function( $id )
    {
		$arFields['RESULT_MESSAGE'] = 'Запрещено удалять дело ID:'.$id;
		return false;
    }
);
```


#### OnActivityDelete

Событие вызываемое после успешного удаления (или перемещения в корзину) элемента методом `CCrmActivity::Delete`.
 
| Параметр | Значение                      |
|:--------:|-------------------------------|
|   $id    | Идентификатор удаленного дела |

Возвращаемое значение не обрабатывается.

Пример подписки на событие:
```php
$eventManager = \Bitrix\Main\EventManager::getInstance();

$eventManager->addEventHandlerCompatible(
    'crm',
    'OnActivityDelete',
    function( $id )
    {
        // You can't get activity by $activityId - already deleted
        // Doesn't matter what you return
    }
);
```