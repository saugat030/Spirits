CREATE TABLE liquors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type_id INTEGER REFERENCES categories(type_id),
    image_link TEXT,
    description TEXT,
    quantity INTEGER
);

create table categories (
	type_id serial primary key,
	type_name varchar(100) not null unique
);