<?php
/**
 * Created by PhpStorm.
 * User: Clinton
 * Date: 5/31/2015
 * Time: 11:08 PM
 */

function imageCleanup($id)
{
    $sql = "SELECT photo_image FROM photos WHERE id=$id";
    $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
    $photoCount = mysql_num_rows($result);
    if ($photoCount > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            unlink("../../assets/images/photos/" . $row['photo_image']);
        }
    }
}
function gigCleanup($id)
{
    $sql = "SELECT photo_image FROM gigs WHERE id=$id";
    $result = mysql_query($sql) or trigger_error(mysql_error() . $sql);
    $photoCount = mysql_num_rows($result);
    if ($photoCount > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            unlink("../../assets/images/gigs/" . $row['photo_image']);
        }
    }
}