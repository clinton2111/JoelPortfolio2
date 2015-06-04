<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/28/2015
 * Time: 11:06 PM
 */
include 'connection.config.php';
$json = file_get_contents('php://input');
$data = json_decode($json);
$baseLimit = null;
if ($data->offset == 0) {
    $id = mysql_result(mysql_query("SELECT MAX(id) FROM $data->fetch"), 0);
    $baseLimit = $id + 1;
} else {
    $baseLimit = $data->offset;
}
if ($data->fetch == 'photos') {
    $response = array();
    try {
        $returnedData = array();
        $sql = "SELECT * FROM photos WHERE id < $baseLimit ORDER BY id DESC LIMIT 8";
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
            $response['message'] = 'No More Photos to Display';
        }
        echo json_encode($response);
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }

} elseif ($data->fetch == 'gigs') {
    $response = array();
    try {
        $returnedData = array();
        $sql = "SELECT * FROM gigs WHERE id < $baseLimit ORDER BY id DESC LIMIT 8";
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
            $response['message'] = 'No More Gigs Found';
        }
        echo json_encode($response);
    } catch (exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
        die();
    }
}