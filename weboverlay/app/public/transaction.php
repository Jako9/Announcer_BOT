<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $pendingPayments = readFromJSON('pendingPayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    if($pendingPaymentsArray != null){
        foreach ($pendingPaymentsArray as $key => $transactionJson) {
            $transaction = json_decode($transactionJson);
    
            if($transaction->transID != null){
                if($transaction->transID == $transactionId){
                    $transaction->status = $state;
                    $pendingPaymentsArray[$key] = json_encode($transaction);
                }
            }
            
        }

        $encodedArrray = json_encode($pendingPaymentsArray);
        file_put_contents('../../../config/pendingPayments.json', $encodedArrray);
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}