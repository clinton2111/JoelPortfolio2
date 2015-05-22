<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/18/2015
 * Time: 4:49 PM
 */
header('Content-Type: application/javascript');
include 'connection.php';
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$json = file_get_contents('php://input');
$data = json_decode($json);

if (isset($data->email) && isset($data->password)) {
    $response = array();
    $email = mysql_real_escape_string($data->email);
    $password = md5(mysql_real_escape_string($data->password));
    $sql = "SELECT id,username FROM `users` WHERE `email`='$email' and `password`='$password'";
    $result = mysql_query($sql) or die(mysql_error());
    $count = mysql_num_rows($result);

    if ($count == 1) {
        $JWT = new JWT;
        $key = md5('mySecretKey');
        $alg = 'HS512';

        $row = mysql_fetch_assoc($result);

        $claim = array(
            'id' => $row['id'],
            'username' => $row['username'],
            'email' => $email,
            'exp' => strtotime('+3 days')
        );

        $response['status'] = 'Success';
        $response['message'] = 'User Verified';
        $response['token'] = $JWT->encode($claim, $key, $alg);
        $response['username'] = $claim['username'];
        $response['id'] = $claim['id'];

    } else {
        $response['status'] = 'Error';
        $response['message'] = 'Invalid Login Details';
    }
    echo json_encode($response);
}
