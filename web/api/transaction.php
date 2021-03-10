<?php

$api = getAPICredFromDatabase();
$password = $api['password'];


if(isset($_POST['transID']) && isset($_POST['state']) && isset($_POST['pass'])){
    if(rtrim($_POST['pass']) == $password){
        $transactionId = rtrim($_POST['transID']);
        $state = $_POST['state'];

        updatePaymentStatus($transactionId, $state);
    }
}


function getPendingsPaymentsFromDatabase(){
    $connection = connectToDatabase();
    $sql = "SELECT * FROM pending_payments";

    $result = $connection->query($sql);
    $arr = array();

    if($result){
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($arr, $row);
        }
    }

    return $arr;
    $connection->close();
}

function getAPICredFromDatabase(){
    $connection = connectToDatabase();
    $sql = "SELECT password FROM api_creds WHERE name='processPayment'";

    $result = $connection->query($sql);

    if($result){
        return $row = $result->fetch_assoc();
    }

    return null;
    $connection->close();
}

function connectToDatabase(){
    $username = $_ENV['DBUSER'];
    $password = $_ENV['DBPASSWORD'];
    $database = $_ENV['DBNAME'];

    $conn = new mysqli('db', $username, $password, $database);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function updatePaymentStatus($transID, $state){
    $connection = connectToDatabase();
    $connection->prepare("UPDATE pending_payments SET status=? WHERE transID=?");

    $result = $connection->get_result();

    $connection->close();
}

?>
