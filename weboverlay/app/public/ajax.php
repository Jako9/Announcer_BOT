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
                echo clearLogOnAjax('debugLog', 'debug.log');
                break;
            case 'reset-boot-log':
                echo clearLogOnAjax('bootLog', 'boot_log.log');
                break;

            case 'reset-error-log':
                echo clearLogOnAjax('errorLog', 'error_log.log');
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
    $logPath = '../../../logs/' . $file;
    file_put_contents($logPath, "");
}

function readLogFile($file){
    $logPath = '../../../logs/' . $file;

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