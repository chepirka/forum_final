<?php
function checkAuth() {
    session_start();
    
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        header('Location: ../html/login.html');
        exit;
    }
    
    // Проверка времени сессии (1 час)
    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time'] > 3600)) {
        session_destroy();
        header('Location: ../html/login.html');
        exit;
    }
    
    // Обновление времени активности
    $_SESSION['login_time'] = time();
    
    return [
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'email' => $_SESSION['email']
    ];
}
?>