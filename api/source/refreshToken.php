<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/19/2015
 * Time: 12:30 PM
 */
header('Content-Type: application/javascript');
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$json = file_get_contents('php://input');
$data = ($json);
$JWT = new JWT;
$key = md5('mySecretKey');
$alg = 'HS512';
$JWT = new JWT;
//$data='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IkNsaW50b24gRHNvdXphIiwiZW1haWwiOiJjbGludG9uX2Rzb3V6YTkyQHlhaG9vLmNvbSIsImV4cCI6MTQzMjMwNzQ2OX0.7SIP-lFArY25Kys4ESxzzzMiqOTnQOvFc8TCqANzqr7d1OOuV1W4upqCPZ5LSzn0fQsmr2nYZsmp7s_QAsAzmA';
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
$response['username']=$claim['username'];
//echo json_encode($old_token);
echo json_encode($response);