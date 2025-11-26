<?php
require 'config.php';

session_start();

// Check if user is logged in and is admin
if (!isset($_SESSION['user_id']) {
    header('Location: index.html');
    exit;
}

if ($_SESSION['user_role'] !== 'admin') {
    header('Location: index.html');
    exit;
}

// Get all bookings
$bookings = $pdo->query("SELECT * FROM bookings ORDER BY created_at DESC")->fetchAll();

// Get all messages
$messages = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll();

// Get all users
$users = $pdo->query("SELECT id, name, email, country, role, created_at FROM users ORDER BY created_at DESC")->fetchAll();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        /* Add admin-specific styles here */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .admin-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
        }
        .admin-header {
            background: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .admin-nav {
            background: #444;
            padding: 10px;
            margin-bottom: 20px;
        }
        .admin-nav a {
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
            margin: 0 5px;
        }
        .admin-nav a:hover {
            background: #555;
        }
        .dashboard-section {
            background: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
            <a href="logout.php" style="color: #fff; background: #d9534f; padding: 5px 10px; border-radius: 3px; text-decoration: none;">Logout</a>
        </div>
        
        <div class="admin-nav">
            <a href="#bookings">Bookings</a>
            <a href="#messages">Messages</a>
            <a href="#users">Users</a>
        </div>
        
        <div id="bookings" class="dashboard-section">
            <h2>Recent Bookings</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Guests</th>
                        <th>Destination</th>
                        <th>Payment Method</th>
                        <th>Leaving Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($bookings as $booking): ?>
                    <tr>
                        <td><?php echo $booking['id']; ?></td>
                        <td><?php echo htmlspecialchars($booking['name']); ?></td>
                        <td><?php echo $booking['guests']; ?></td>
                        <td><?php echo htmlspecialchars($booking['destination']); ?></td>
                        <td><?php echo htmlspecialchars($booking['payment_method']); ?></td>
                        <td><?php echo $booking['leaving_date']; ?></td>
                        <td><?php echo ucfirst($booking['status']); ?></td>
                        <td>
                            <a href="edit_booking.php?id=<?php echo $booking['id']; ?>">Edit</a> |
                            <a href="delete_booking.php?id=<?php echo $booking['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <div id="messages" class="dashboard-section">
            <h2>Recent Messages</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($messages as $message): ?>
                    <tr>
                        <td><?php echo $message['id']; ?></td>
                        <td><?php echo htmlspecialchars($message['name']); ?></td>
                        <td><?php echo htmlspecialchars($message['email']); ?></td>
                        <td><?php echo htmlspecialchars($message['phone'] ?? 'N/A'); ?></td>
                        <td><?php echo htmlspecialchars($message['subject'] ?? 'No subject'); ?></td>
                        <td><?php echo substr(htmlspecialchars($message['message']), 0, 50) . '...'; ?></td>
                        <td><?php echo $message['created_at']; ?></td>
                        <td>
                            <a href="view_message.php?id=<?php echo $message['id']; ?>">View</a> |
                            <a href="delete_message.php?id=<?php echo $message['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <div id="users" class="dashboard-section">
            <h2>Registered Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?php echo $user['id']; ?></td>
                        <td><?php echo htmlspecialchars($user['name']); ?></td>
                        <td><?php echo htmlspecialchars($user['email']); ?></td>
                        <td><?php echo htmlspecialchars($user['country']); ?></td>
                        <td><?php echo ucfirst($user['role']); ?></td>
                        <td><?php echo $user['created_at']; ?></td>
                        <td>
                            <a href="edit_user.php?id=<?php echo $user['id']; ?>">Edit</a> |
                            <a href="delete_user.php?id=<?php echo $user['id']; ?>" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>