<?php

if(isset($_POST['transID']) && isset($_POST['state'])){
    $transactionId = $_POST['transID'];
    $state = $_POST['state'];

    $pendingPayments = readFromJSON('pendingpayments.json');
    $pendingPaymentsArray = $pendingPayments->transactions;

    if($pendingPaymentsArray != null){
        foreach ($pendingPayments->transactions as $key => $transactionJson) {
            $transaction = json_decode($transactionJson);
    
            if($transaction->transId != null){
                if($transaction->transId == $transactionId){
                    $transaction->state = $state;
                }
            }

            $pendingPaymentsArray[$key] = json_encode($transaction);
        }

        $encodedArrray = json_encode($pendingPaymentsArray)
        file_put_contents('../../../config/pendingpayments.json', $encodedArrray);
    }
}


function readFromJSON($file){
    $json = file_get_contents('../../../config/' . $file);
    return json_decode($json);
}