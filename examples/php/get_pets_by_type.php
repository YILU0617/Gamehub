<?php
  header('Content-type: application/json');
 
  // get connection info
  $config = parse_ini_file("config.ini");   // better to hide this!
  $server = $config["host"];
  $username = $config["user"];
  $password = $config["password"];
  $database = $config["database"];

  // create the connection
  $cn = mysqli_connect($server, $username, $password, $database);
 
  // get pet type from URL parameters
  $pet_type = $_GET["type"];

  // execute query
  $q = "SELECT id, name FROM pet WHERE type = ?";
  $st = $cn->stmt_init();
  $st->prepare($q);
  $st->bind_param("s", $pet_type);
  $st->execute();
  $st->bind_result($id, $name);

  // output result (as collections of name-value pairs)
  echo '['; 
  $more_rows = $st->fetch();
  while ($more_rows) {
    echo '{"id": ' . $id . ', "name": "' . $name . '"}';
    $more_rows = $st->fetch();      
    if ($more_rows)
      echo ', ';
  }
  echo ']';
    
  $st->close();
  $cn->close();

?>
