<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/30/2015
 * Time: 12:03 AM
 */
require_once '../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
include 'connection.config.php';
$json = file_get_contents('php://input');
$data = json_decode($json);
$response = array();
$message = array();

//SMTPSend($message, $SMTPDetails);
if ($data->type == 'contact') {
    $message['From'] = 'noreply@djjoelgoa.in';
    $message['FromName'] = $data->name . ' (via. djjoel.com - Website)';

    $message['To'] = 'clinton92@gmail.com';
    $message['ToName'] = 'Clinton D\'souza';

    $message['Reply'] = trim($data->address);
    $message['ReplyName'] = $data->name;

    $message['Subject'] = $data->subject;
    $message['Body'] = htmlentities($data->msg);
    $message['AltBody'] = htmlentities($data->msg);

    $message['SuccessMessage']='Message Sent';

    try {
        SMTPSend($message, $SMTPDetails);
    } catch (Exception $e) {
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }
}elseif ($data->type == 'recoverPassword') {
    $email = mysql_real_escape_string($data->email);
    try {
        $sql = "SELECT id,username FROM users WHERE BINARY email='$email'";
        $result = mysql_query($sql) or die(mysql_error());
        $count = mysql_num_rows($result);

        if ($count == 1) {
            $row = mysql_fetch_assoc($result);
            $id = $row['id'];
            $username = $row['username'];
            $length = 100;
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, $charactersLength - 1)];
            }

            $URL = "http://djjoel.com/admin/#/auth/recovery/" . $email . '/' . $randomString;
            $msgStructure = 'Hello ' . $username . '<br> You have recently requested to retrieve your lost account password. Please click the link below to reset your password <br> <a href="' . $URL . '">Click Here</a>';

            $message['From'] = 'noreply@joel.com';
            $message['FromName'] = 'DJ Joel - Password Recovery';

            $message['To'] = $email;
            $message['ToName'] = $username;

            $message['Reply'] = null;
            $message['ReplyName'] = null;

            $message['Subject'] = 'Password Recovery Link';
            $message['Body'] = $msgStructure;
            $message['AltBody'] = htmlentities($msgStructure);

            $message['SuccessMessage']='Message Sent. Please check your Inbox';

            try {
                SMTPSend($message, $SMTPDetails);
                $sql = "UPDATE users SET temp_password='$randomString' WHERE id=$id";
                $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
            } catch (Exception $e) {
                $response['status'] = 'Error';
                $response['message'] = $e->getMessage();
                echo json_encode($response);
            }




        } else {
            header('HTTP/1.0 401 Unauthorized');
            $response['status'] = 'Error';
            $response['message'] = 'No user registered with that email id';
            echo json_encode($response);
        }

    } catch (exception $e) {
        header('HTTP/1.0 401 Unauthorized');
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }
}

function SMTPSend($message, $SMTPDetails)
{
    $response = array();
    $mail = new PHPMailer();

    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->CharSet = 'UTF-8';

    $mail->Host = $SMTPDetails['Host'];
    $mail->Username = $SMTPDetails['Username'];
    $mail->Password = $SMTPDetails['Password'];

    $mail->SMTPSecure = $SMTPDetails['SMTPSecure'];
    $mail->Port = $SMTPDetails['Port'];

    $mail->From = $message['From'];
    $mail->FromName = $message['FromName'];

    //To address and name
    $mail->addAddress($message['To'], $message['ToName']);

    //Address to which recipient will reply
    $mail->addReplyTo($message['Reply'], $message['ReplyName']);

    // indicates ReturnPath header
    $mail->Sender = $message['Reply'];

    $mail->Subject = $message['Subject'];
    $mail->Body = $message['Body'];
    $mail->AltBody = $message['AltBody'];

    if (!$mail->send()) {
        $response['status'] = 'Error';
        $response['message'] = $mail->ErrorInfo;
    } else {
        $response['status'] = 'Success';
        $response['message'] = $message['SuccessMessage'];
    }
    echo json_encode($response);

//    echo '<pre>';
//    var_dump($message);
//    echo '</pre>';

}