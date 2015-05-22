<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/19/2015
 * Time: 12:30 PM
 */
header('Content-Type: application/javascript');
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$headers = apache_request_headers();
$data = str_replace("Bearer ", "", $headers['Authorization']);
$JWT = new JWT;
$key = md5('mySecretKey');
$alg = 'HS512';
$JWT = new JWT;
$old_token = $JWT->decode($data, $key, array($alg));
$claim = array(
    'id' => $old_token->id,
    'username' => $old_token->username,
    'email' => $old_token->email,
    'exp' => strtotime('+3 days')
);
$response = array();
$response['status'] = 'Success';
$response['message'] = 'Token Refreshed';
$response['token'] = $JWT->encode($claim, $key, $alg);
$response['username'] = $claim['username'];
$response['id'] = $claim['id'];
//echo json_encode($old_token);
echo json_encode($response);