<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/26/2015
 * Time: 10:45 AM
 */
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$json = file_get_contents('php://input');
$data = json_decode($json);
$JWT = new JWT;
$headers = apache_request_headers();
$header = str_replace("Bearer ", "", $headers['Authorization']);
try {
    $decoded_token = $JWT->decode($header, $key, array($alg));
    if ($data->location === 'photos') {
        updatePhotoCaption($data);
    } else if ($data->location === 'gigs') {
        updateGigs($data);
    }
} catch (DomainException $ex) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Invalid token";
    exit();
}

function updatePhotoCaption($data)
{
    $response = array();
    try {
        $sql = "UPDATE photos SET caption='$data->caption' WHERE id=$data->id";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Caption Updated';
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Something went wrong try again';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e;
        echo json_encode($response);
        die();
    }
}