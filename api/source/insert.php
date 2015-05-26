<?php
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
$json = file_get_contents('php://input');
$data = json_decode($_POST['data']);
$JWT = new JWT;
$headers = apache_request_headers();
$header = str_replace("Bearer ", "", $headers['Authorization']);
try {
    $decoded_token = $JWT->decode($header, $key, array($alg));
    if ($data->location === 'photos') {
        insertPhotos($data);
    } else if ($data->location === 'gigs') {
        insertGig($data);
    }
} catch (DomainException $ex) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Invalid token";
    exit();
}

function insertPhotos($data)
{
    $response = array();
    $image = addslashes(file_get_contents($_FILES['file']['tmp_name']));
    $caption = addslashes($data->caption);
    try {
        $insert = "INSERT INTO photos (photo_image,caption) VALUES ('" . $image . "','" . $caption . "')";
        $result = mysql_query($insert) or die(mysql_error());
        $id = mysql_insert_id();
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Photo uploaded successfully';
            $response['id'] = $id;
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Photo upload failed';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e;
        echo json_encode($response);
    }
}

function insertGig()
{
    echo 'inside Gig function';
}