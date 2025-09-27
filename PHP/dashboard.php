<?php
session_start();

// Подключение к БД для проверки куки
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "forum";

// Если нет сессии, но есть куки "Запомнить меня"
if (!isset($_SESSION['logged_in']) && isset($_COOKIE['remember_user']) && isset($_COOKIE['remember_token'])) {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND remember_token = ? AND token_expires > NOW()");
        $stmt->execute([$_COOKIE['remember_user'], $_COOKIE['remember_token']]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Автоматический вход
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['logged_in'] = true;
        }
    } catch(PDOException $e) {
        // Ошибка - просто продолжаем без авто-логина
    }
}

// Проверка авторизации
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: ../html/login.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .dashboard-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .user-info { background-color: #e9ecef; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .logout-btn { background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 4px; text-decoration: none; display: inline-block; }
        .logout-btn:hover { background-color: #c82333; }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <h2>Добро пожаловать, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <div class="user-info">
            <p><strong>Имя пользователя:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($_SESSION['email']); ?></p>
        </div>
        <a href="../PHP/logout.php" class="logout-btn">Выйти</a>
    </div>
</body>
</html>