<?php
include_once "loadSDK.php";

$dir = "/Apps/dbinbox";
$folderMetadata = $dbxClient->getMetadataWithChildren($dir);
// ordenar por fecha
// $path = $child['path'];  // ruta del archivo
// $file = basename($path); // nombredelarchivo
// $size = $child['size']; //size
// echo json_encode($folderMetadata['contents']);
echo json_encode(dateToUTC($folderMetadata['contents']));