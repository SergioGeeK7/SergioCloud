<?php
require_once "dropbox-sdk/Dropbox/autoload.php";
require_once "Helps.php";
use \Dropbox as dbx;
dbx\AppInfo::loadFromJsonFile("../privateConfig.json");
$config = readConfig("../privateConfig.json");
$dbxClient = new dbx\Client($config["token"], "PHP-Example/1.0");
$addFile = dbx\WriteMode::add();
?>
