<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $pendingPayments = readFromJSON('pendingPayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    error_log(print_r($pendingPayments, true));
    error_log("transaktionsID: " . $transactionId . " Status: " . $state);

    if($pendingPaymentsArray != null){
        for ($i = 0; count($pendingPaymentsArray); $i++) {
            $transactionJson = $pendingPaymentsArray[i];

            $transaction = json_decode($transactionJson);
    
            if($transaction->transID != null){
                if($transaction->transID == $transactionId){
                    $transaction->status = $state;
                    $pendingPaymentsArray[$i] = json_encode($transaction);
                }
            }
            
        }

        $pendingPayments->transactions = $pendingPaymentsArray;

        $encodedArrray = json_encode($pendingPayments);
        file_put_contents('../../../config/pendingPayments.json', $encodedArrray);
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}