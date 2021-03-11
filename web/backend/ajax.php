<?php

session_start();

if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] != true){
    header("location: login.php");
    exit;
}

handleAjax();

function handleAjax(){
    if(isset($_POST['action']) && !empty($_POST['action'])) {
        $action = $_POST['action'];
        switch ($action){
            case 'reload-debug-log':
                $resp = array();
                $resp['debugLog'] = readLogFile("debug.log");
                echo json_encode($resp);
                break;
            case 'reload-boot-log':
                $resp = array();
                $resp['bootLog'] = readLogFile("boot_log.log");
                echo json_encode($resp);
                break;
            case 'reload-error-log':
                $resp = array();
                $resp['errorLog'] = readLogFile("error_log.log");
                echo json_encode($resp);
                break;
            case 'reset-debug-log':
                echo clearLogOnAjax('debugLog', 'debug');
                break;
            case 'reset-boot-log':
                echo clearLogOnAjax('bootLog', 'boot');
                break;

            case 'reset-error-log':
                echo clearLogOnAjax('errorLog', 'error');
                break;
        }
    }
}

function clearLogOnAjax($arg, $file){
    $resp = array();
    $resp[$arg] = "success";
    clearLogFile($file);
    return json_encode($resp);
}

function clearLogFile($file){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://node:3000/log/clear/" . $file);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    $output = curl_exec($ch);

    $decodedAnswer = json_decode($output);

    curl_close($ch);
}

function readLogFile($file){
    $logPath = '/var/www/logs/' . $file;

    if(file_exists($logPath)){
        $logContent = '';

        $handle = @fopen($logPath, "r");
        if ($handle) {
            while (($buffer = fgets($handle, 4096)) !== false) {
                $logContent .= $buffer . "<br>";
            }
            if (!feof($handle)) {
                echo "Fehler: unerwarteter fgets() Fehlschlag\n";
            }
            fclose($handle);
        }

        return $logContent;
    }else{
        return "";
    }
}