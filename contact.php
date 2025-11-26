<?php
// Ensure no output before headers
if (ob_get_level()) ob_end_clean();

header('Content-Type: application/json');
require_once 'config.php';

// Disable HTML errors
ini_set('html_errors', 0);
error_reporting(E_ALL ^ E_WARNING);

$response = ['success' => false, 'message' => ''];

try {
    // Get raw input
    $json = file_get_contents('php://input');
    if (empty($json)) {
        throw new Exception('No data received');
    }

    $input = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON format');
    }

    // Debug: Log received input
    error_log("Received data: " . print_r($input, true));

    // Validate required fields - check both existence and non-empty string
    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || trim($input[$field]) === '') {
            throw new Exception(ucfirst($field) . ' is required');
        }
    }

    // Additional validations
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    if (strlen($input['message']) < 10) {
        throw new Exception('Message should be at least 10 characters');
    }

    // Database insertion
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", 
        $input['name'],
        $input['email'],
        $input['phone'] ?? null,
        $input['subject'] ?? null,
        $input['message']
    );

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Message sent successfully!';
    } else {
        throw new Exception('Database error: ' . $stmt->error);
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Contact Form Error: " . $e->getMessage());
}

// Ensure only JSON is output
die(json_encode($response));
?>