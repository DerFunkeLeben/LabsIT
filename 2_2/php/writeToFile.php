<?php

$response = ["status" => "error"];

$file = '../data/carts/' . $_POST["file"] . '.csv';

if (isset($_POST["csvData"]) && file_put_contents($file, $_POST["csvData"])) {
    $response = ["status" => "success", "csvData" => $_POST["csvData"]];
}

echo json_encode($response);

exit;
