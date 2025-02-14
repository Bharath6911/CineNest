<?php
// login.php
session_start();
$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $db_host     = "sqlxxx.infinityfree.com";  
        $db_username = "";
        $db_password = "";
        $db_name     = "";

    // Create a new database connection
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Get the username and password from the form
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Prepare a statement to retrieve the user record
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    if ($stmt) {
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        // Check if exactly one record is found
        if ($stmt->num_rows == 1) {
            $stmt->bind_result($id, $db_username, $hashed_password);
            $stmt->fetch();
            // Verify the provided password against the stored hash
            if (password_verify($password, $hashed_password)) {
                $_SESSION['isLoggedIn'] = true;
                $_SESSION['username'] = $username;
                header("Location: h.html"); 
                exit;
            } else {
                $error = "Invalid username or password.";
            }
        } else {
            $error = "Invalid username or password.";
        }
        $stmt->close();
    } else {
        $error = "Database error: could not prepare statement.";
    }
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - CineNest</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #121212;
      color: white;
    }
    .login-container {
      z-index: 1;
      padding: 20px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      text-align: center;
    }
    .login-container input {
      width: 90%;
      padding: 10px;
      margin: 5px 0;
      border: none;
      border-radius: 4px;
    }
    .login-container button {
      padding: 10px;
      margin-top: 10px;
      width: 95%;
      border: none;
      border-radius: 4px;
      background-color:rgb(37, 150, 190);
      color: white;
      font-weight: bold;
    }
    .error {
      color: #ff4500;
    }
    .poster-container {
      position: absolute;
      width: 135%;
      height: 135%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      z-index: 0;
      pointer-events: none;
    }
    .poster-row {
      display: flex;
      gap: 20px;
      overflow: hidden;
    }
    .poster-row img {
      width: 200px;
      height: 250px;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
    }
    .row-right {
      animation: scroll-right 25s linear infinite;
    }
    .row-left {
      animation: scroll-left 25s linear infinite;
    }
    @keyframes scroll-right {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    @keyframes scroll-left {
      from { transform: translateX(100%); }
      to { transform: translateX(-100%); }
    }
  </style>
</head>
<body>
  <div class="login-container">
      <h1>Welcome to CineNest</h1>
      <?php if ($error != '') { echo "<p class='error'>{$error}</p>"; } ?>
      <form method="post" action="log.php">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="register.php" style="color:#ff4500;">Register here</a></p>
  </div>
  
  <div class="poster-container">
      <div class="poster-row row-left">
          <img src="image/img1.jpg" alt="Poster 1">
          <img src="image/img2.jpg" alt="Poster 2">
          <img src="image/img3.jpg" alt="Poster 3">
          <img src="image/img4.jpg" alt="Poster 4">
          <img src="image/img5.jpg" alt="Poster 5">
      </div>
      <div class="poster-row row-right">
          <img src="image/img6.jpg" alt="Poster 6">
          <img src="image/img7.jpg" alt="Poster 7">
          <img src="image/img8.jpg" alt="Poster 8">
          <img src="image/img9.jpg" alt="Poster 9">
          <img src="image/img10.jpg" alt="Poster 10">
      </div>
      <div class="poster-row row-left">
          <img src="image/img11.jpg" alt="Poster 11">
          <img src="image/img12.jpg" alt="Poster 12">
          <img src="image/img13.jpg" alt="Poster 13">
          <img src="image/img14.jpg" alt="Poster 14">
          <img src="image/img15.jpg" alt="Poster 15">
      </div>
  </div>
</body>
</html>
