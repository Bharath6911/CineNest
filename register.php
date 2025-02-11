<?php
// register.php

// Uncomment these lines during development to show errors (disable in production)
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

$error = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize inputs
    $email    = trim($_POST['email']);
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    $confirm  = $_POST['confirm_password'];

    // Basic validation: check if passwords match
    if ($password !== $confirm) {
        $error = "Passwords do not match.";
    } else {
        $db_host     = "sql106.infinityfree.com";  
        $db_username = "if0_38293542";
        $db_password = "9966322665";
        $db_name     = "if0_38293542_cinenestdb";

        $conn = new mysqli($db_host, $db_username, $db_password, $db_name);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Check if username already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $error = "Username already taken. Please choose another.";
        } else {
            // Hash the password before storing it
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            // Insert new user into the database
            $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $email, $username, $hashed_password);
            if ($stmt->execute()) {
                // Registration successful – redirect to the login page
                header("Location: log.php");
                exit;
            } else {
                $error = "Error during registration. Please try again.";
            }
        }
        $stmt->close();
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register - CineNest</title>
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
    .register-container {
      z-index: 1;
      padding: 20px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 8px;
      text-align: center;
    }
    .register-container input {
      width: 90%;
      padding: 10px;
      margin: 5px 0;
      border: none;
      border-radius: 4px;
    }
    .register-container button {
      padding: 10px;
      margin-top: 10px;
      width: 95%;
      border: none;
      border-radius: 4px;
      background-color: #ff4500;
      color: white;
      font-weight: bold;
    }
    .error {
      color: #ff4500;
    }
    /* Poster container styles for theme consistency */
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
  <div class="register-container">
      <h1>Register for CineNest</h1>
      <?php if ($error != '') { echo "<p class='error'>{$error}</p>"; } ?>
      <form method="post" action="register.php">
          <input type="email" name="email" placeholder="Email" required>
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <input type="password" name="confirm_password" placeholder="Re-type Password" required>
          <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="log.php" style="color:#ff4500;">Login here</a></p>
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
