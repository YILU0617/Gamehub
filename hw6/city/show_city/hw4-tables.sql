
/**********************************************************************
 * NAME: YI LU
 * CLASS:cs 321
 * DATE:10/20
 * HOMEWORK: hw6
 * DESCRIPTION: 
 **********************************************************************/


-- NOTE: This file should create the CIA factbook tables from HW-3
--       plus the additional rows you may need to show that your
--       queries are working properly.


-- TODO: add drop table statements
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS province;
DROP TABLE IF EXISTS border;
DROP TABLE IF EXISTS country;


-- TODO: add create table statements
CREATE TABLE country(
    country_code CHAR(3) ,
    country_name VARCHAR(100),
    gdp DECIMAL(15,2),
    inflation DECIMAL(5,2),
    PRIMARY KEY(country_code)
);

CREATE TABLE province(
    province_name VARCHAR(100),
    country_code CHAR(3),
    area DECIMAL(20,2),
    PRIMARY KEY(province_name,country_code),
    FOREIGN KEY(country_code) REFERENCES country(country_code)
);

CREATE TABLE city(
    city_name VARCHAR(100),
    province_name VARCHAR(100),
    country_code CHAR(3),
    population INT,
    PRIMARY KEY(city_name,province_name,country_code),
    FOREIGN KEY(province_name,country_code) REFERENCES province(province_name,country_code)
);

CREATE TABLE border(
    country_code_1 CHAR(3),
    country_code_2 CHAR(3),
    border_length DECIMAL(20,2),
    PRIMARY KEY(country_code_1,country_code_2),
    FOREIGN KEY(country_code_1) REFERENCES country(country_code),
    FOREIGN KEY(country_code_2) REFERENCES country(country_code)
);



-- TODO: add insert statements

--- Inserting data for country table
INSERT INTO country(country_code, country_name, gdp, inflation) VALUES
('USA', 'United States of America', 21000000, 1.5),
('CAN', 'Canada', 1700000, 2.0),
('BRA', 'Brazil', 1300000, 3.5),
('ARG', 'Argentina', 450000, 2.5),
('MEX', 'Mexico', 1200000, 4.0),
('FCT', 'FictionLand', 3000000, 3.0), 
('ISL', 'Islandia', 50000, 2.0), 
('ABC', 'RichLand', 2500000, 1.5),
('CBA', 'PoorVille', 900000, 4.5);


-- Inserting data for province table
INSERT INTO province(province_name, country_code, area) VALUES
('California', 'USA', 423967),
('Ontario', 'CAN', 1076395),
('Sao Paulo', 'BRA', 248209),
('Buenos Aires', 'ARG', 307571),
('Oregon', 'USA', 254800),
('Maine', 'USA', 91633),
('Jalisco', 'MEX', 78588);

-- Inserting data for city table
INSERT INTO city(city_name, province_name, country_code, population) VALUES
('Los Angeles', 'California', 'USA', 3792621),
('San Francisco', 'California', 'USA', 870887),
('Toronto', 'Ontario', 'CAN', 2731571),
('Sao Paulo City', 'Sao Paulo', 'BRA', 12038175),
('Buenos Aires City', 'Buenos Aires', 'ARG', 2890151),
('Portland', 'Oregon', 'USA', 650000),
('Salem', 'Oregon', 'USA', 169000),
('Portland', 'Maine', 'USA', 66000),
('Guadala', 'Jalisco', 'MEX', 169000); 

-- Inserting data for border table
INSERT INTO border(country_code_1, country_code_2, border_length) VALUES
('USA', 'CAN', 8891),
('USA', 'MEX', 3142),
('BRA', 'ARG', 1224),
('USA', 'FCT', 0), 
('CAN', 'FCT', 0), 
('MEX', 'ISL', 0),
('ABC', 'CBA', 2345);

