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
} elseif ($data->type == 'recoverPassword') {
    include 'connection.config.php';
    $mail = new PHPMailer;
    $response = array();
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

            $mail->From = 'noreply@joel.com';
            $mail->FromName = 'DJ Joel - Password Recovery';
            $mail->Subject = "Password Recovery Link";
            $URL = "http://djjoel.com/admin/#/auth/recovery/" . $email . '/' . $randomString;
            $message = 'Hello ' . $username . '<br> You have recently requested to retrieve your lost account password. Please click the link below to reset your password <br> <a href="' . $URL . '">Click Here</a>';
            $mail->Body = $message;
            $mail->addAddress($email, $username);
            $mail->isHTML(true);

            if (!$mail->send()) {
                $response['status'] = 'Error';
                $response['message'] = $mail->ErrorInfo;
            } else {
                $sql = "UPDATE users SET temp_password='$randomString' WHERE id=$id";
                $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
                $response['status'] = 'Success';
                $response['message'] = 'Message Sent. Please check your Inbox';
                $response['url'] = $URL;
            }


        } else {
            header('HTTP/1.0 401 Unauthorized');
            $response['status'] = 'Error';
            $response['message'] = 'No user registered with that email id';
        }
        echo json_encode($response);
    } catch (exception $e) {
        header('HTTP/1.0 401 Unauthorized');
        $response['status'] = 'Error';
        $response['message'] = $e->getMessage();
        echo json_encode($response);
    }

} elseif ($data->type == 'updatePassword') {
    include 'connection.config.php';
    $response = array();
    $email = $data->email;
    $temp_pass = $data->value;
    $password = $data->password;
    $empty = "";
    try {
        $sql = "UPDATE users SET password='$password' WHERE email='$email' and temp_password='$temp_pass' ";
        $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
        $delete = "UPDATE users SET temp_password='$empty' WHERE email='$email'";
        $result2 = mysql_query($delete) or die(mysql_error());
        $response['status'] = 'Success';
        $response['message'] = 'Password Updated';
        echo json_encode($response);
    } catch (excpetion $e) {
        $response['status'] = 'Error';
        $response['message'] = 'Something went wrong';
        echo json_encode($response);
    }

}