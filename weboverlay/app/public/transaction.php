<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $pendingPayments = readFromJSON('pendingPayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    if($pendingPaymentsArray != null){
        for ($i = 0; $i < count($pendingPaymentsArray); $i++) {
            
            $transaction = $pendingPaymentsArray[$i];
    
            if($transaction->transID != null){
                echo('Sind die string gleich: ' . (strcmp(strval($transaction->transID), strval($transactionId)) == 0));
                if(strcmp(strval($transaction->transID), strval($transactionId)) == 0){
                    $transaction->status = $state;
                    $pendingPaymentsArray[$i] = $transaction;
                }
            }
            
        }

        echo("unten: " . print_r($pendingPaymentsArray, true));

        $pendingPayments->transactions = $pendingPaymentsArray;

        $encodedArrray = json_encode($pendingPayments);
        file_put_contents('../../../config/pendingPayments.json', $encodedArrray);
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}