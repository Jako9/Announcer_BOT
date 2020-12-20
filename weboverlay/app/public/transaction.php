<?php

$api = readFromJSON('api.json');
$processPayment = $api->processPayment;
$password = $processPayment->password;


if(isset($_POST['transID']) && isset($_POST['state']) && isset($_POST['pass'])){
    if(rtrim($_POST['pass']) == $password){
        $transactionId = rtrim($_POST['transID']);
        $state = $_POST['state'];

        $pendingPayments = readFromJSON('pendingPayments.json');
        $pendingPaymentsArray = $pendingPayments->transactions;


        updatePaymentStatus($transactionId, $state);
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}

function connectToDatabase(){
    $creds = readFromJSON('database.json');
    $username = $creds->user;
    $password = $creds->password;
    $database = $creds->database;

    $conn = new mysqli('localhost', $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function updatePaymentStatus($transID, $state){
    $connection = connectToDatabase();
    $sql = "UPDATE pending_payments SET status='". $state ."'  WHERE transID='" . $transID . "'";

    $result = $connection->query($sql);

    $connection->close();
}

?>
