<?php
require_once "loadSDK.php";

$root = "/Apps/dbinbox/";
// getMetadata(path)
$file = basename($_GET['file']);
$path = $root.$file;

// si hay punto esta entrando en el otro
if (stripos($path, ".") !== false) {
    $url = $dbxClient->createTemporaryDirectLink($path);
    $type = "application/force-download";
    //Definir headers
    header("Content-Type: $type");
   // Descargar archivo
    header("Content-Disposition: attachment; filename=$file");
    header("Content-Transfer-Encoding: binary");
    readfile($url[0]."?dl=1");
} else {
    $url = $dbxClient->createShareableLink($path) . "?dl=1";
    header("Location:" . $url);
}