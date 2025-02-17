create table users(
id_user serial primary key,
username varchar(20),
name varchar(20),
lastname varchar(20),
email varchar,
password varchar,
birthday date,
address varchar,
tokenid varchar
);

create table products(
id_product serial primary key,
product_name varchar,
product_description varchar,
product_price integer, 
product_quantity integer default 1,
product_photo varchar,
product_category varchar,
seller integer,
constraint fk_seller_user foreign key(seller) references users(id_user) on delete cascade
);

create table cart(
user_id integer,
product_id integer,
total_quantity integer,
constraint pk_cart_products primary key(user_id, product_id),
constraint fk_cart_user foreign key(user_id) references users(id_user),
constraint fk_cart_product foreign key(product_id) references products(id_product)
);

create table orders(
id_order serial primary key,
order_user integer,
order_total integer,
order_date timestamp,
constraint fk_order_user foreign key(order_user) references users(id_user)
);

create table order_details(
order_id integer, 
order_product integer,
product_order_price integer,
product_order_quantity integer,
constraint pk_orders_products primary key(order_id, order_product),
constraint fk_order_details_orders foreign key (order_id) references orders(id_order),
constraint fk_order_details_products foreign key (order_product) references products(id_product)
);





