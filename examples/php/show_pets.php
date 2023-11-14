<html>
<body>
<?php

  // connection params
  $config = parse_ini_file("config.ini");   // better to hide this!
  $server = $config["host"];
  $username = $config["user"];
  $password = $config["password"];
  $database = $config["database"];

  // connect to db   
  $cn = mysqli_connect($server, $username, $password, $database);

  // check connection
  if (!$cn) {
    die("Connection failed: " . mysqli_connect_error());
  }
  // execute a simple query
  $q = "SELECT * FROM pet ORDER BY name";
  $rs = mysqli_query($cn, $q); 

  // retrieve results via result set
  if (mysqli_num_rows($rs) > 0) {
    echo "<p><em>Current Pets</em></p>\n";
    echo "<ol>\n";
    while($row = mysqli_fetch_assoc($rs)) {  // fetch as associative array
      echo "<li>" . $row["name"] . " is a " . $row["type"] . "</li>\n";
    }
    echo "</ol>\n";
  }
  else {
    echo "<b>No Pets</b>\n";
  }

  mysqli_close($cn);

?>
</body>
</html>  
