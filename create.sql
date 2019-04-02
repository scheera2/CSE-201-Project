CREATE TABLE appTest (
    id serial PRIMARY KEY,
    name text,
    descrip text,
    developer text,
    platform text,
    platformv text,
    price int

);

INSERT INTO appTest(name, descrip, developer, platform, platformv, price)
VALUES ('test1', 'This is the first test', 'WeDS', 'PC', '1.0', 999999999);

CREATE TABLE appUsers (
    id serial PRIMARY KEY,
    username character varying(255) UNIQUE,
    email character varying(255),
    password character varying(255)
)