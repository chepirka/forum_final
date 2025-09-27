<?php
session_start();

// Удаляем куки "Запомнить меня"
setcookie('remember_user', '', time() - 3600, '/');
setcookie('remember_token', '', time() - 3600, '/');

// Уничтожаем сессию
session_destroy();

header('Location: ../html/login.html');
exit;
?>