## Instalación

1. Levantar base de datos:

``` sh
make up
```

2. Crear archivo .env:

``` sh
make env
```

3. Instalar dependencias:
``` sh
npm install
```

4. Correr migraciones:
``` sh
npm run migrate
npm run migrate-test
```

5. Correr seeders (opcional, es necesario tener creado al menos dos usuarios, debido a que el seeder inserta datos para el usuario 1 y 2, caso contrario los datos se pueden agregar a mano):
``` sh
npm run seed
```

### Variables de entorno a configurar:

``` sh
SECRET (necesario para el password hash)
NODE_ENV (enviroment)
PORT (puerto en el que va a correr la app)
``` 

### Conectarse a las bases de datos de forma externa utilizando Sequel Pro o DBeaver.

Para conectarse a la base de datos de forma externa deben utilizar los siguientes parámetros:

Base de datos:

-   Host: localhost
-   Port: 3309
-   Username: root
-   Password: root
-   Database: contacts

Base de datos TEST:

-   Host: localhost
-   Port: 3310
-   Username: root
-   Password: root
-   Database: contacts_test

### Test

Si desean correr la suite completa de tests se debe de usar el siguiente comando

```bash
npm run test
```
