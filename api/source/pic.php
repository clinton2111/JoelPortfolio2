<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/22/2015
 * Time: 8:29 PM
 */
include 'connection.config.php';
$from = stripslashes($_GET['from']);
$id = stripslashes($_GET['id']);
$image = mysql_query("SELECT * FROM $from WHERE id = '" . $id . "'");
$image = mysql_fetch_assoc($image);
$image = $image['photo_image'];
header("Content-type:image/jpeg");
echo $image;
