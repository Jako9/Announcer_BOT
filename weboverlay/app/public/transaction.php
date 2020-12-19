<?php

$api = readFromJSON('api.json');
$processPayment = $api->processPayment;
$password = $processPayment->password;


if(isset($_POST['transID']) && isset($_POST['state']) && isset($_POST['pass'])){
    echo($_POST['pass']);
    echo($password);
    if(rtrim($_POST['pass']) == $password){
        $transactionId = rtrim($_POST['transID']);
        $state = $_POST['state'];

        $pendingPayments = readFromJSON('pendingPayments.json');
        $pendingPaymentsArray = $pendingPayments->transactions;

        if($pendingPaymentsArray != null){
            for ($i = 0; $i < count($pendingPaymentsArray); $i++) {
                
                $transaction = $pendingPaymentsArray[$i];
        
                if($transaction->transID != null){
                    if(strval($transaction->transID) == strval($transactionId)){
                        $transaction->status = $state;
                        $pendingPaymentsArray[$i] = $transaction;
                    }
                }
                
            }

            $pendingPayments->transactions = $pendingPaymentsArray;

            $encodedArrray = json_encode($pendingPayments);
            file_put_contents('../../../config/pendingPayments.json', $encodedArrray);
        }
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}


?>
