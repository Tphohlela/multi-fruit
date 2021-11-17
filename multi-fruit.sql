create table multi_fruit_basket(
id serial primary key, 
name text not null
 );

INSERT INTO multi_fruit_basket (id,name) VALUES (1,'Golden delicious');
INSERT INTO multi_fruit_basket (id,name) VALUES (2,'Granny smith');
INSERT INTO multi_fruit_basket (id,name) VALUES (3,'Cling peach');
INSERT INTO multi_fruit_basket (id,name) VALUES (4,'Nectarine');

 create table fruit_basket_item(
multi_fruit_basket_id integer,
fruit_type text not null,
qty integer,
unit_price DECIMAL(10,2),
foreign key (multi_fruit_basket_id) references multi_fruit_basket(id)
);


