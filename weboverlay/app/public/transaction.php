<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $json = file_get_contents('../../../config/' . 'pendingPayments.json');

    $pendingPayments = json_decode('pendingPayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    return $json;
    echo("transaktionsID: " . $transactionId . " Status: " . $state);

    if($pendingPaymentsArray != null){
        for ($i = 0; $i < count($pendingPaymentsArray); $i++) {
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