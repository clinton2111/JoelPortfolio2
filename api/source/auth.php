<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/18/2015
 * Time: 4:49 PM
 */
header('Content-Type: application/javascript');
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$json = file_get_contents('php://input');
$data = json_decode($json);

if ($data->type == 'login') {

    if (isset($data->email) && isset($data->password)) {
        $response = array();
        $email = mysql_real_escape_string($data->email);
        $password = mysql_real_escape_string($data->password);
        try {
            $sql = "SELECT id,username FROM users WHERE BINARY email='$email' and password='$password'";
            $result = mysql_query($sql) or die(mysql_error());
            $count = mysql_num_rows($result);

            if ($count == 1) {
                $JWT = new JWT;

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
                header('HTTP/1.0 401 Unauthorized');
                $response['status'] = 'Error';
                $response['message'] = 'Invalid Login Details';
            }
            echo json_encode($response);
        } catch (exception $e) {
            header('HTTP/1.0 401 Unauthorized');
            $response['status'] = 'Error';
            $response['message'] = $e->getMessage();
            echo json_encode($response);
        }
    }
} elseif ($data->type == 'updatePassword') {
    $response = array();
    $email = $data->email;
    $temp_pass = $data->value;
    $password = $data->password;
    $empty = "";
    try {
        $sql = "UPDATE users SET password='$password' WHERE email='$email' and temp_password='$temp_pass' ";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $delete = "UPDATE users SET temp_password='$empty' WHERE email='$email'";
        $result2 = mysql_query($delete) or die(mysql_error());
        $response['status'] = 'Success';
        $response['message'] = 'Password Updated';
        echo json_encode($response);
    } catch (excpetion $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }

}