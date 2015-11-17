<?php
require_once "loadSDK.php";

$root = "/Apps/dbinbox/";
// getMetadata(path)
//$_GET['file'] = "test";
$file = basename($_GET['file']);
$path = $root.$file;

// if there is a (.) is a folder
if (stripos($path, ".") !== false) {
    $url = $dbxClient->createTemporaryDirectLink($path);
    //set headers
    header("Content-Type: application/force-download");
    header("Content-Disposition: attachment; filename=$file");
    header("Content-Transfer-Encoding: binary");
    //readfile($url[0]."?dl=1");
    readfile($url[0]);
} else {
    $url = $dbxClient->createShareableLink($path);
    $url = substr($url,0,strlen($url)-1); // to force download
    header("Location:" . $url."1");
}