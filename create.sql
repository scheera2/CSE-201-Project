CREATE TABLE appTest
(
    id serial PRIMARY KEY,
    name text,
    descrip text,
    developer text,
    platform text,
    platformv text,
    price int

);

INSERT INTO appTest
    (name, descrip, developer, platform, platformv, price)
VALUES
    ('test1', 'This is the first test', 'WeDS', 'PC', '1.0', 999999999),
    ('test2', 'This is the second test', 'YEET', 'Potato', '0.01', 1);

CREATE TABLE appUsers
(
    id serial PRIMARY KEY,
    username character varying(255) UNIQUE,
    email character varying(255),
    password character varying(255)
);

ALTER TABLE appUsers
    ADD mod INT;
ALTER TABLE appUsers
    ADD admin INT;

CREATE TABLE appTestPending
(
    id serial PRIMARY KEY,
    name text,
    descrip text,
    developer text,
    platform text,
    platformv text,
    price int

);

ALTER TABLE appTestPending 
    ADD username text;

CREATE TABLE subMessage (
    id int PRIMARY KEY,
    name text,
    descrip text,
    message text
);

ALTER TABLE subMessage 
    ADD A_D text;
ALTER TABLE subMessage
    ADD username text;
ALTER TABLE subMessage
    ADD admin text;

