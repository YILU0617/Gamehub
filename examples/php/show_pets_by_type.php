
<html>
<body>
<h1>Pets by Type</h1>
<?php
  // get connection info
  $config = parse_ini_file("config.ini");   // better to hide this!
  $server = $config["host"];
  $username = $config["user"];
  $password = $config["password"];
  $database = $config["database"];

  // create the connection
  $cn = mysqli_connect($server, $username, $password, $database);
 
  // get the pet type from the form:
  $pet_type = $_POST["PetTypeChoice"];
  echo "<p>Category: " . $pet_type . "</p>";

  // create the prepared statement
  $q = "SELECT id, name, appearance FROM pet WHERE type = ?";
  $st = $cn->stmt_init();
  $st->prepare($q);
  $st->bind_param("s", $pet_type); // "s" for string

  // execute the statement and bind the result (to vars)
  $st->execute();
  $st->bind_result($id, $name, $appearance);

  // output result
  echo "<p>Pet ids, names, and appearances:</p>\n";
  echo "<ul>\n";
  while ($st->fetch()) {
    echo "<li>" . $id . ", " . $name . ", " . $appearance . "</li>\n";
  }
  echo "</ul>\n";

  // clean up
  $st->close();
  $cn->close();
?>
</body>
</html>
