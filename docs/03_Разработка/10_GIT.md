Хорошей практикой, да и жизненной необходимостью является наличие на проекте системы контроля версий и де-факто наиболее распространенной системой является `git`. В [официальной документации](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=43&LESSON_ID=5119) приводится пример использования Mercurial и мы посчитали необходимой составить полный и избыточный файл конфигурации `.gitignore`: 

```
*.log
*.xml
*.txt
*.csv
*.json
*.json.example
*.xls
*.xslx
*.tgz
*.old
*.tar
*.zip
/.htsecure
/urlrewrite.php

# Cache section
/bitrix/cache
/bitrix/managed_cache
/bitrix/stack_cache

# Raw php files ib bitrix folder
/bitrix/[^/]*\.php$

# Legacy fields
/bitrix/web.config

# Technical bitrix folder
/bitrix/backup
/bitrix/image_uploader
/bitrix/webdav
/bitrix/modules
/bitrix/sounds
/bitrix/services
/bitrix/activities
/bitrix/otp
/bitrix/themes
/bitrix/tools
/bitrix/css
/bitrix/images
/bitrix/panel
/bitrix/gadgets
/bitrix/mobileapp
/bitrix/blocks
/bitrix/admin
/bitrix/updates
/bitrix/js
/bitrix/fonts
/bitrix/catalog_export

# Bitrix parts
/bitrix/activities/bitrix
/bitrix/components/bitrix
/bitrix/gadgets/bitrix
/bitrix/wizards/bitrix

/bitrix/php_interface/dbconn.php
/bitrix/php_interface/after_connect.php
/bitrix/php_interface/after_connect_d7.php

# File storage & tmp directories
/upload
/bitrix/tmp
```

Это громоздкая и переусложненная конфигурация позволяет использовать максимум гибкости в разработке, однако всегда нужно стремиться чтобы на вашем проекте был следующий конфигурационный файл:

```
*.log
*.txt

.htsecure

/bitrix/*
/urlrewrite.php
/upload
```