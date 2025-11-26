<?php
require_once 'config.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'booking_id' => null];

// Start session to get user ID if logged in
session_start();
$user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

// Get and sanitize input data
$data = json_decode(file_get_contents('php://input'), true);

$name = sanitize_input($data['name']);
$guests = (int)sanitize_input($data['guests']);
$destination = sanitize_input($data['destination']);
$payment = sanitize_input($data['payment']);
$leaving = sanitize_input($data['leaving']);

// Validate inputs
if (empty($name) || empty($guests) || empty($destination) || empty($payment) || empty($leaving)) {
    $response['message'] = 'All fields are required!';
    echo json_encode($response);
    exit;
}

if ($guests <= 0) {
    $response['message'] = 'Number of guests must be positive!';
    echo json_encode($response);
    exit;
}

// Insert booking
$stmt = $conn->prepare("INSERT INTO bookings (user_id, name, guests, destination, payment_method, leaving_date, status) 
                        VALUES (?, ?, ?, ?, ?, ?, 'pending')");
$stmt->bind_param("isssss", $user_id, $name, $guests, $destination, $payment, $leaving);

if ($stmt->execute()) {
    $booking_id = $stmt->insert_id;
    
    $response['success'] = true;
    $response['message'] = 'Booking successful!';
    $response['booking_id'] = $booking_id;
    $response['name'] = $name;
    $response['guests'] = $guests;
    $response['destination'] = $destination;
    $response['leaving'] = $leaving;
} else {
    $response['message'] = 'Booking failed: ' . $conn->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>