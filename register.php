<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Get and sanitize input data
$name = sanitize_input($_POST['name']);
$email = sanitize_input($_POST['email']);
$password = sanitize_input($_POST['password']);
$country = sanitize_input($_POST['country']);

// Validate inputs
if (empty($name) || empty($email) || empty($password) || empty($country)) {
    $response['message'] = 'All fields are required!';
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Invalid email format!';
    echo json_encode($response);
    exit;
}

if (strlen($password) < 8) {
    $response['message'] = 'Password must be at least 8 characters!';
    echo json_encode($response);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if email already exists
$check_email = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check_email->bind_param("s", $email);
$check_email->execute();
$check_email->store_result();

if ($check_email->num_rows > 0) {
    $response['message'] = 'Email already registered!';
    echo json_encode($response);
    exit;
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password, country, role) VALUES (?, ?, ?, ?, 'user')");
$stmt->bind_param("ssss", $name, $email, $hashed_password, $country);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Registration successful!';
} else {
    $response['message'] = 'Registration failed: ' . $conn->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>