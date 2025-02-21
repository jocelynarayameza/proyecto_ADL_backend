# Hito 3 - Proyecto Final ADL

Integrantes: Jocelyn Araya y Millaray Painemil

## Instalación

```bash
npm i express pg jest supertest jsonwebtoken dotend bcrypt cors 
```
En el archivo Script-18.sql está la configuración de las tablas a ocupar en PostgreSQL.

## Organización del proyecto

El archivo principal es server.js y luego se divide en 5 rutas: index, usuarios, productos, carrito y pedidos/orders.
### Carpetas
#### - Routes: Contiene las rutas hacia los controladores.
#### - Controllers: Contiene los controladores que van a llamar a las consultas de modules.
#### - Modules: Contiene las consultas a la base de datos.
#### - Config: Contiene base de datos.
#### - Middlewares: Contiene los middlewares utilizados para validar consultas y autenticar al usuario.
#### - Test: Contiene los test con archivos diferenciados por 4 de las grandes rutas (usuarios, productos, carrito y pedidos).



## Usuarios

### POST/api/usuarios/registro
Registro de un nuevo usuario. No se necesita autentificación.
```javascript
{
        "email":"test@tienda.cl",
        "password":"12341234",
        "username": "test_tienda",
        "name": "Test",
        "lastname":"Test",
        "email_confirm":"test@tienda.cl",
        "password_confirm":"12341234",
        "birthday": "2020-03-06"
    }
```
### POST/api/usuarios/iniciar-sesion
Inicio sesión con un usuario ya existente. No se necesita autentificación.
```javascript
{
      "email": "test@tienda.cl",
      "password": "12341234"
    }
```
### GET/api/usuarios/perfil
Ver perfil del usuario que inició sesión. Necesita autenticación a través de Bearer token.

### PUT/api/usuarios/editar-perfil
Se edita el usuario, el dato que se quiera cambiar es el que se modifica. Necesita autenticación a través de Bearer token.
```javascript
{  
    "emailChange":"",
	"nameChange": "",
    "lastnameChange": "",
    "passwordChange": ""
}
```

### PUT/api/usuarios/editar-direcccion
Se edita la dirección del usuario autenticado. Inicialmente la dirección se registra como "No se registra dirección" automáticamente. Necesita autenticación a través de Bearer token.
```javascript
{
	"addressChange": "Calle 9, comuna, ciudad, pais, codigo postal"
}
```
### GET/api/usuarios/cerrar-sesion
Se cierra sesión del usuario. Necesita autenticación a través de Bearer token.

### DELETE/api/usuarios/eliminar
Se elimina el usuario con sus productos publicados, carrito y sus pedidos anteriores realizados. Necesita autenticación a través de Bearer token.

## Productos
### GET/api/productos/
Ver todos los productos registrados en la base de datos. No se necesita autentificación.

### GET/api/productos/:idProducto
Ver el detalle del producto con id específico. No se necesita autentificación.

### GET/api/productos/mis-productos
Ver todos los productos registrados por el usuario. Necesita autenticación a través de Bearer token.

### POST/api/productos/mis-productos/agregar
El usuario agrega un producto a la venta. Necesita autenticación a través de Bearer token.
```javascript
{
    "product_name": "Nombre producto",
    "product_description":  "Descripcion",
    "product_price": 10000,
    "product_quantity": 20,
    "product_photo": "URL de la imagen",
    "product_category": "Categoria"
}
```
### GET/api/productos/mis-productos/:idProducto
Ve el detalle del producto con el id especifico. Necesita autenticación a través de Bearer token.

### PUT/api/productos/mis-productos/:idProducto
El usuario edita la información de uno de sus producto a la venta por id, se puede poner un campo a editar o los 6. Necesita autenticación a través de Bearer token.
```javascript
{
    "product_price": 50000
}
```
### DELETE/api/productos/mis-productos/:idProducto
Se elimina el producto con el id en específico. Necesita autenticación a través de Bearer token.

## Carrito
### GET/api/carrito/
Ver todos los productos añadidos al carrito. Necesita autenticación a través de Bearer token.

### POST/api/carrito/editar
Tiene 3 funciones esta ruta.Necesita autenticación a través de Bearer token.
#### Agregar nuevo producto cuando la cantidad es 1
```javascript
{
      "id_product": 8,
      "total_quantity": 1
  }
```
#### Editar un producto ya agregado cuando la cantidad es >1. No se puede sobrepasar el stock del producto publicado.
```javascript
{
      "id_product": 8,
      "total_quantity": 10
  }
```
#### Eliminar producto cuando la cantidad es 0
```javascript
{
      "id_product": 8,
      "total_quantity": 0
  }
```

### POST/api/carrito/comprar
Se crea una orden con todos los productos y sus cantidades específicas añadidas al carrito anteriormente, y además se crea el detalle de cada producto comprado. Necesita autenticación a través de Bearer token.

### DELETE/api/carrito/eliminar
Se eliminan todos los productos agregados al carrito. Necesita autenticación a través de Bearer token.

## Pedidos
### GET/api/pedidos
Ver todos los pedidos realizados anteriormente por el usuario. Necesita autenticación a través de Bearer token.

### GET/api/pedidos/mis-pedidos/:idPedido
Ver el detalle del pedido al mostrar los productos comprados. Necesita autenticación a través de Bearer token.

### POST//api/pedidos/repetir-pedido/:idPedido
Volver a repetir el mismo pedido realizado anteriormente, añadiendo los productos al carrito. Necesita autenticación a través de Bearer token.
