<?php

$filename="donation.json";
if (isset($_POST["json"])) {
    file_put_contents($filename,$_POST["json"]);
}

?>