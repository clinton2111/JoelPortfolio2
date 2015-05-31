<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/25/2015
 * Time: 7:54 PM
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
        fetchPhotos($data);
    } else if ($data->location === 'gigs') {
        fetchGigs($data);
    }
} catch (DomainException $ex) {
    header('HTTP/1.0 401 Unauthorized');
    echo "Invalid token";
    exit();
}
function fetchPhotos($data)
{
    $response = array();
    try {
        $returnedData = array();
        $sql = "SELECT * FROM photos ORDER BY id DESC";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $photoCount = mysql_num_rows($result);
        if ($photoCount > 0) {
            while ($row = mysql_fetch_assoc($result)) {
                $returnedData[] = $row;
            }
            $response['status'] = 'Success';
            $response['message'] = 'Data present';
            $response['results'] = $returnedData;
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'No photos found';
        }
        echo json_encode($response);
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }

}

function fetchGigs($data)
{
    $response = array();
    try {
        $returnedData = array();
        $sql = "SELECT * FROM gigs ORDER BY event_date DESC";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $gigCount = mysql_num_rows($result);
        if ($gigCount > 0) {
            while ($row = mysql_fetch_assoc($result)) {
                $returnedData[] = $row;
            }
            $response['status'] = 'Success';
            $response['message'] = 'Data present';
            $response['results'] = $returnedData;
        } else {
            $response['status'] = 'Error';
            $response['message'] = 'No Gigs found';
        }
        echo json_encode($response);
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}