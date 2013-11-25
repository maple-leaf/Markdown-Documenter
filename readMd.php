<?php
$filePath = $_FILES['file']['tmp_name'];
$file = fopen($filePath, 'r');
header('Content-Type: text/plain');
echo fread($file, filesize($filePath));
fclose($file);
?>
