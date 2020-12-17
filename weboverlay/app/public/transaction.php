<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $pendingPayments = readFromJSON('pendingPayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    if($pendingPaymentsArray != null){
        for ($i = 0; $i < count($pendingPaymentsArray); $i++) {
            
            $transaction = $pendingPaymentsArray[$i];
            echo("oben: " . print_r($transaction, true));
    
            if($transaction->transID != null){
                if($transaction->transID == $transactionId){
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