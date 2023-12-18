const express = require("express");
const mysql = require('mysql2');

const app = express();
const config = require('./config.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 
app.set('view engine', 'ejs');
app.set('views', 'view'); 


const cn = mysql.createConnection(config);
cn.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to database');
});

app.post('/add-review', (req, res) => {
    const { gameId, author, rating, reviewContent } = req.body;

    const query = 'INSERT INTO GameReviews (GameID, ReviewContent, Author, Rating, PublishDate) VALUES (?, ?, ?, ?, NOW())';
    cn.query(query, [gameId, reviewContent, author, rating], (err, result) => {
        if (err) {
            console.error('Error adding review: ', err);
            res.status(500).send('Error adding review.');
        } else {

            res.redirect(`/game-intro?game_id=${gameId}`);
        }
    });
});
app.post('/delete-review', (req, res) => {
    const reviewId = req.body.reviewId;
    const gameId = req.body.gameId; 


    const query = 'DELETE FROM GameReviews WHERE ReviewID = ?';
    cn.query(query, [reviewId], (err, result) => {
        if (err) {
            console.error('Error deleting review: ', err);
            res.status(500).send('Error deleting review.');
        } else {

            const referer = req.get('referer');
            
 
            res.redirect(referer);
        }
    });
});

app.get('/add-review-page', (req, res) => {

    const query = 'SELECT * FROM GameInformation';
    cn.query(query, (err, games) => {
        if (err) {
            console.error('Error fetching game list: ', err);
            res.status(500).send('Error fetching game list');
            return;
        }


        res.render('add-review-page', { games: games });
    });
});

app.post('/add-review', (req, res) => {
    const { gameName, author, rating, reviewContent } = req.body;

    const query = 'SELECT GameID FROM GameInformation WHERE GameName = ?';
    cn.query(query, [gameName], (err, result) => {
        if (err) {
            console.error('Error fetching GameID: ', err);
            res.status(500).send('Error fetching GameID');
            return;
        }

        if (result.length > 0) {
            const gameId = result[0].GameID;


            const insertQuery = 'INSERT INTO GameReviews (GameID, ReviewContent, Author, Rating, PublishDate) VALUES (?, ?, ?, ?, NOW())';
            cn.query(insertQuery, [gameId, reviewContent, author, rating], (err) => {
                if (err) {
                    console.error('Error adding review: ', err);
                    res.status(500).send('Error adding review.');
                } else {

                    res.redirect(`/game-intro?game_id=${gameId}`);
                }
            });
            
        } else {
            res.status(404).send('Game not found');
        }
    });
});





app.get('/', (req, res) => {

    const query = 'SELECT * FROM GameInformation';
    cn.query(query, (err, games) => {
        if (err) {
            console.error('Error fetching game information: ', err);
            res.status(500).send('Error fetching game information');
            return;
        }
        res.render('homepage', { games: games });
    });
});


app.get('/game-reviews', (req, res) => {

    const query = `
    SELECT GameReviews.*, GameInformation.GameName
    FROM GameReviews
    JOIN GameInformation ON GameReviews.GameID = GameInformation.GameID
    GROUP BY GameInformation.GameID
    ORDER BY RAND();`;

    cn.query(query, (err, reviews) => {
        if (err) {
            console.error('Error fetching game reviews: ', err);
            res.status(500).send('Error fetching game reviews');
            return;
        }
        res.render('game-reviews', { reviews: reviews });
    });
});
app.get('/community-forums', (req, res) => {

    res.render('community-forums');
});




app.get('/strategy-guides', (req, res) => {

    const query = 'SELECT * FROM StrategyGuides'; 
    cn.query(query, (err, games) => {
        if (err) {
            console.error('Error fetching game data: ', err);
            res.status(500).send('Error fetching game data');
            return;
        }

        res.render('strategy-guides', { games: games });
    });
});



app.get('/game-intro', (req, res) => {
    const gameId = req.query.game_id; 

 
    cn.query('SELECT * FROM GameInformation WHERE GameID = ?', [gameId], (err, gameInfo) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

   
        cn.query('SELECT * FROM GameReviews WHERE GameID = ?', [gameId], (err, reviews) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.render('game-intro', { gameInfo: gameInfo[0], reviews: reviews });
        });
    });
});

app.get('/game-intro-detail', (req, res) => {
    const gameName = req.query.game_name;


    cn.query('SELECT * FROM GameInformation WHERE GameName = ?', [gameName], (err, gameInfo) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (gameInfo.length === 0) {

            res.status(404).send('Game not found');
            return;
        }


        cn.query('SELECT * FROM GameReviews WHERE GameName = ?', [gameName], (err, reviews) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }

  
            res.render('game-intro', { gameInfo: gameInfo[0], reviews: reviews });
        });
    });
});


app.get('/register', (req, res) => {

    res.render('register');
});



app.post('/register', (req, res) => {
    const { username, password, email, age } = req.body;


    cn.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error checking username: ', err);
            res.status(500).send('Error checking username.');
            return;
        }

        if (results.length > 0) {

            const errorMessage = 'Username already exists. Please choose a different username.';
            const script = `<script>
                document.getElementById('errorMessage').textContent = "${errorMessage}";
                document.getElementById('errorMessage').style.display = "block";
            </script>`;
            res.send(script);
        } else {

            const newUser = {
                username: username,
                password: password,
                email: email,
                age: age,
            };

            cn.query('INSERT INTO Users SET ?', newUser, (err) => {
                if (err) {
                    console.error('Error registering user: ', err);
                    res.status(500).send('Error creating user.');
                } else {

                    res.redirect('/login');
                }
            });
        }
    });
});




app.get('/user', (req, res) => {
    const username = req.query.username;

    cn.query('SELECT * FROM Users WHERE Username = ?', [username], (err, userInfo) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        cn.query('SELECT * FROM GameReviews WHERE Author = ?', [username], (err, userReviews) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Internal Server Error');
                return;
            }
        
            res.render('user', { userInfo: userInfo[0], reviews: reviews });
        });
    });
});






app.get('/strategy-guide-detail', (req, res) => {
    const guideId = req.query.guide_id;


    const query = 'SELECT * FROM StrategyGuides WHERE GuideID = ?';
    cn.query(query, [guideId], (err, strategyGuide) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }


        res.render('strategy-guide-detail', { strategyGuide: strategyGuide[0] });
    });
});




app.get('/login', (req, res) => {

    res.render('login');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;


    const query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
    cn.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.status(500).send('Error');
            return;
        }

        if (results.length > 0) {
      
            const user = results[0];
            res.render('user', { user });
        } else {
     
            res.status(404).send('User not found');
        }
    });
});

// Define your routes

app.get('/user/:username', (req, res) => {
    const username = req.params.username;
    
    // Fetch user data from the database based on the username
    const query = 'SELECT * FROM Users WHERE Username = ?';
    cn.query(query, [username], (err, userResults) => {
        if (err) {
            console.error('Error querying database: ', err);
            res.status(500).send('Error');
            return;
        }

        if (userResults.length > 0) {
            const user = userResults[0];

            // Fetch the user's favorite games from the database
            const favoriteGamesQuery = 'SELECT game_name FROM favoritegame WHERE username = ?';
            cn.query(favoriteGamesQuery, [username], (err, favoriteGamesResults) => {
                if (err) {
                    console.error('Error querying favorite games: ', err);
                    res.status(500).send('Error');
                    return;
                }
                console.log("1");
                const favoriteGames = favoriteGamesResults.map(game => game.game_name);
                console.log(favoriteGames);
                
                // Render the user profile page with user data and favorite games
                res.render('user', { user, favoriteGames });
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});






app.listen(3000, () => {
    console.log('Server running on port 3000');
});