<?php
$name = $_POST['name'];
$feedback = $_POST['your_feedback'];
$ranking = $_POST['ranking'];

$msg = 'Request received :<br/><br/>' . "name :" . $name ."<br/>feedback :" . $feedback . "<br/>ranking:" .$ranking;
echo $msg;
?>