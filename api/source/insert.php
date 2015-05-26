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
    $image=null;
    $fileTempName=($_FILES['file']['tmp_name']);
    $fileName=($_FILES['file']['name']);
    $caption = null;
    if(isset($data->caption)){
        $caption=addslashes($data->caption);
    }else{
        $caption='';
    }
    $fileSize = $_FILES['file']['size'];
    if ($fileSize > 1000000) {
        include 'imageCompressor.php';
        try {
            $moveResult=move_uploaded_file($fileTempName,"../uploads/$fileName");
            if($moveResult == true){
                $source="../uploads/$fileName";
                $destination="../uploads/resized_$fileName";
                $image=compress_image($source,$destination,60); //change last parameter to change quality
                unlink($source);
                unlink($destination);
            }

        } catch (exception $e) {
            $response['status'] = 'Error';
            $response['message'] = $e;
            echo json_encode($response);
            die();
        }
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
        $response['message'] = $e;
        echo json_encode($response);
        die();
    }
}

function insertGig()
{
    echo 'inside Gig function';
}