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
    include 'imageCompressor.php';
    $response = array();
    $fileTempName = ($_FILES['file']['tmp_name']);
    $fileName = ($_FILES['file']['name']);
    $caption = null;
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $mod_name = uniqid() . ".$ext";
    $fileSize = $_FILES['file']['size'];
    if (isset($data->caption)) {
        $caption = addslashes($data->caption);
    } else {
        $caption = '';
    }
    try {
        $moveResult = move_uploaded_file($fileTempName, "../assets/temp_images/$fileName");
        if ($moveResult == true) {
            $source = "../assets/temp_images/$fileName";
            $destination = "../../assets/images/photos/$mod_name";
            if ($fileSize > 1000000) {
                $quality = 60;
            } else {
                $quality = 90;
            }
            compress_image($source, $destination, $quality); //change last parameter to change quality
            unlink($source);
        }
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }

    try {
        $insert = "INSERT INTO photos (photo_image,caption) VALUES ('" . $mod_name . "','" . $caption . "')";
        $result = mysql_query($insert) or die(mysql_error());
        $id = mysql_insert_id();
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Photo uploaded successfully';
            $response['id'] = $id;
            $response['imageName'] = $mod_name;
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Photo upload failed';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}

function insertGig($data)
{
    include 'imageCompressor.php';
    $response = array();
    $image = null;
    $fileTempName = ($_FILES['file']['tmp_name']);
    $fileName = ($_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $mod_name = uniqid() . ".$ext";
    try {
        $moveResult = move_uploaded_file($fileTempName, "../assets/temp_images/$fileName");
        if ($moveResult == true) {
            $source = "../assets/temp_images/$fileName";
            $destination = "../../assets/images/gigs/$mod_name";
            if ($fileSize > 1000000) {
                $quality = 60;
            } else {
                $quality = 90;
            }
            compress_image($source, $destination, $quality); //change last parameter to change quality
            unlink($source);
        }
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
    try {
        $insert = "INSERT INTO gigs (title,address,latitude,longitude,event_date,fb_link,photo_image) VALUES ('" . $data->title . "','" . $data->address . "','" . $data->lat . "','" . $data->lng . "','" . $data->date . "','" . $data->fbLink . "','" . $mod_name . "')";
        $result = mysql_query($insert) or die(mysql_error());
        $id = mysql_insert_id();
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Gig Data uploaded successfully';
            $response['id'] = $id;
            $response['imageName'] = $mod_name;
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Gig upload failed';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}