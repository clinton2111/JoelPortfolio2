<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/26/2015
 * Time: 10:45 AM
 */
include 'connection.config.php';
require_once '../vendor/firebase/php-jwt/Authentication/JWT.php';
include 'resourceCleaner.php';
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
        } else if ($data->location === 'password') {
            updatePassword($data);
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
    require_once 'imageCompressor.php';
    $data = json_decode($_POST['data']);
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
        gigCleanup($data->id);
        $sql = "UPDATE gigs SET photo_image='$mod_name' WHERE id=$data->id";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        if ($result == 1) {
            $response['status'] = 'Success';
            $response['message'] = 'Poster Updated';
            $response['imageName'] = $mod_name;
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

function updatePassword($data)
{
    $response = array();
    try {
        $sql = "SELECT 1 FROM users WHERE BINARY id='$data->id' and password='$data->currentPassword'";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $Count = mysql_num_rows($result);
        if ($Count == 1) {
            $sql2 = "UPDATE users SET password='$data->newPassword' WHERE id=$data->id";
            $result2 = mysql_query($sql2) or trigger_error(mysql_error() . $sql2);
            if ($result2 == 1) {
                $response['status'] = 'Success';
                $response['message'] = 'Password Updated';
            }
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'Incorrect password. Please enter your current password';
        }
        echo json_encode($response);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}