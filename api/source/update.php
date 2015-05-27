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
$contentHeaders = explode(';', $headers['Content-Type'], 2);
try {
    $decoded_token = $JWT->decode($header, $key, array($alg));
    if ($contentHeaders[0] != 'multipart/form-data') {
        if ($data->location === 'photos') {
            updatePhotoCaption($data);
        } else if ($data->location === 'gigs' && $data->updateType === 'info') {
            updateGigsInfo($data);
        }
    } elseif ($contentHeaders[0] == 'multipart/form-data') {
        updateGigPoster();
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
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}

function updateGigPoster()
{
    $data = json_decode($_POST['data']);
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
        $sql = "UPDATE gigs SET photo_image='$image' WHERE id=$data->id";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Poster Updated';
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Something went wrong try again';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }

}

function updateGigsInfo($data)
{
    $response = array();
    try {
        $sql = "UPDATE gigs SET title='$data->title',address='$data->address',latitude='$data->lat',longitude='$data->lng',event_date='$data->date',fb_link='$data->fbLink' WHERE id=$data->id";
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
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}