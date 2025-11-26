<?php
// Database configuration
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root'); // Replace with your database username
define('DB_PASS', ''); // Replace with your database password
define('DB_NAME', 'travel_agency');

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4 for full Unicode support
$conn->set_charset("utf8mb4");

// Function to sanitize input data
function sanitize_input($data) {
    global $conn;
    return htmlspecialchars(strip_tags(trim($conn->real_escape_string($data))));
}
?>