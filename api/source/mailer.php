<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/30/2015
 * Time: 12:03 AM
 */
require_once '../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
$json = file_get_contents('php://input');
$data = json_decode($json);
if ($data->type == 'contact') {
    $response = array();
    $mail = new PHPMailer;

//From email address and name
    $mail->From = $data->address;
    $mail->FromName = $data->name;

//To address and name
    $mail->addAddress("clinton92@gmail.com", "Clinton D'souza");

//Address to which recipient will reply
    $mail->addReplyTo($data->address, "Reply");

//Send HTML or Plain Text email
    $mail->isHTML(false);

    $mail->Subject = "Sent from djjoelgoa.com";
    $mail->Body = htmlentities($data->msg);
    $mail->AltBody = htmlentities($data->msg);

    if (!$mail->send()) {
        $response['status'] = 'Error';
        $response['message'] = $mail->ErrorInfo;
    } else {
        $response['status'] = 'Success';
        $response['message'] = 'Message Sent';
    }
    echo json_encode($response);
}