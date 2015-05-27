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
    $image = null;
    $fileTempName = ($_FILES['file']['tmp_name']);
    $fileName = ($_FILES['file']['name']);
    $caption = null;
    if (isset($data->caption)) {
        $caption = addslashes($data->caption);
    } else {
        $caption = '';
    }
    $fileSize = $_FILES['file']['size'];
    if ($fileSize > 1000000) {
        include 'imageCompressor.php';
        try {
            $moveResult = move_uploaded_file($fileTempName, "../uploads/$fileName");
            if ($moveResult == true) {
                $source = "../assets/temp_images/$fileName";
                $destination = "../assets/temp_images/resized_$fileName";
                $image = compress_image($source, $destination, 60); //change last parameter to change quality
                unlink($source);
                unlink($destination);
            }

        } catch (exception $e) {
            $response['status'] = 'Error';
            $response['message'] = $e->getMessage();
            echo json_encode($response);
            die();
        }
    } else {
        $image = addslashes(file_get_contents($_FILES['file']['tmp_name']));
    }
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
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}

function insertGig($data)
{
    $response = array();
    $image = null;
    $fileTempName = ($_FILES['file']['tmp_name']);
    $fileName = ($_FILES['file']['name']);
    $fileSize = $_FILES['file']['size'];
    if ($fileSize > 1000000) {
        include 'imageCompressor.php';
        try {
            $moveResult = move_uploaded_file($fileTempName, "../uploads/$fileName");
            if ($moveResult == true) {
                $source = "../assets/temp_images/$fileName";
                $destination = "../assets/temp_images/resized_$fileName";
                $image = compress_image($source, $destination, 60); //change last parameter to change quality
                unlink($source);
                unlink($destination);
            }

        } catch (exception $e) {
            $response['status'] = 'Error';
            $response['message'] = $e->getMessage();
            echo json_encode($response);
            die();
        }
    } else {
        $image = addslashes(file_get_contents($_FILES['file']['tmp_name']));
    }
    try {
        $insert = "INSERT INTO gigs (title,address,latitude,longitude,event_date,fb_link,photo_image) VALUES ('" . $data->title . "','" . $data->address . "','" . $data->lat . "','" . $data->lng . "','" . $data->date . "','" . $data->fbLink . "','" . $image . "')";
        $result = mysql_query($insert) or die(mysql_error());
        $id = mysql_insert_id();
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Gig Data uploaded successfully';
            $response['id'] = $id;
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