<?php
require_once "loadSDK.php";

$path = isset($_POST["path"]) ? "/Apps/dbinbox/".$_POST["path"]."/" : "/Apps/dbinbox/" ; 

//var_dump($_FILES["files"]);
//return;
$targetFile  = basename($_FILES["files"]["name"][0]);

// open and save
$f = fopen($_FILES["files"]["tmp_name"][0], "rb");
$result = $dbxClient->uploadFile($path.$targetFile, $addFile, $f);
fclose($f);
json_encode("Ok");
?>