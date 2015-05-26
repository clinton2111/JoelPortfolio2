<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/26/2015
 * Time: 9:29 PM
 */
function compress_image($source_url, $destination_url, $quality)
{
    $info = getimagesize($source_url);

    if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($source_url);
    elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($source_url);
    elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($source_url);

    //save file
    imagejpeg($image, $destination_url, $quality);

    //return destination file
    $instr = fopen($destination_url,"rb");
    $new_image = addslashes(fread($instr,filesize($destination_url)));
    return $new_image;
}