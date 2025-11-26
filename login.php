<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Get and sanitize input data
$email = sanitize_input($_POST['email']);
$password = sanitize_input($_POST['password']);

// Validate inputs
if (empty($email) || empty($password)) {
    $response['message'] = 'Email and password are required!';
    echo json_encode($response);
    exit;
}

// Find user by email
$stmt = $conn->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response['message'] = 'Invalid email or password!';
    echo json_encode($response);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    $response['message'] = 'Invalid email or password!';
    echo json_encode($response);
    exit;
}

// Start session and store user data
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_role'] = $user['role'];

$response['success'] = true;
$response['message'] = 'Login successful!';
$response['role'] = $user['role'];

$stmt->close();
$conn->close();

echo json_encode($response);
?>