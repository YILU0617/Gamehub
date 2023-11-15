DROP TABLE IF EXISTS pet;

CREATE TABLE pet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    appearance VARCHAR(255)
);

INSERT INTO pet (name, type, appearance) VALUES
('Max', 'dog', 'Golden Retriever'),
('Bella', 'dog', 'Labrador'),
('Kitty', 'cat', 'Siamese'),
('Shadow', 'cat', 'Persian'),
('Tweety', 'bird', 'Canary'),
('Sky', 'bird', 'Parrot'),
('Goldie', 'fish', 'Goldfish'),
('Nemo', 'fish', 'Clownfish'),
('Bunny', 'rabbit', 'Angora'),
('Thumper', 'rabbit', 'Dwarf'),
('Shelly', 'turtle', 'Box Turtle'),
('Speedy', 'turtle', 'Red-eared Slider'),
('Hammy', 'hamster', 'Syrian Hamster'),
('Fuzzy', 'hamster', 'Dwarf Hamster');

