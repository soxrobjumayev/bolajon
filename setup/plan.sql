
drop table if exists posts cascade;
create extension pgcrpyto;

create database  bolajon;

\c bolajon;

drop table users cascade;
-- CREATE TABLE users (
--     user_id SERIAL PRIMARY KEY,
--     ism VARCHAR(100) NOT NULL,
--     familya VARCHAR(100) NOT NULL,
--     tugilgan_sana DATE NOT NULL CHECK (tugilgan_sana <= CURRENT_DATE),
--     yashash_joy TEXT NOT NULL,
--     maktab VARCHAR(150) NOT NULL,
--     sinf VARCHAR(50) NOT NULL,
--     telefon_nomer VARCHAR(20) NOT NULL UNIQUE CHECK (telefon_nomer ~ '^\+?\d{9,15}$'),
--     parol TEXT NOT NULL
-- );

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    ism VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(ism)) >= 2),
    familya VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(familya)) >= 2),
    tugilgan_sana DATE NOT NULL 
        CHECK (
            tugilgan_sana <= CURRENT_DATE AND 
            tugilgan_sana >= CURRENT_DATE - INTERVAL '100 years'
        ),
    yashash_joy TEXT NOT NULL CHECK (LENGTH(TRIM(yashash_joy)) >= 3),
    maktab VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(maktab)) >= 3),
    sinf VARCHAR(50) NOT NULL,
    telefon_nomer VARCHAR(20) NOT NULL UNIQUE 
        CHECK (telefon_nomer ~ '^\+998[0-9]{9}$'),
    parol_hesh TEXT NOT NULL CHECK (LENGTH(parol_hesh) >= 60),
    royxatdan_otgan_vaqt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);



insert into users(title, photo, user_id) values 
('post', 'text.png', 7);










