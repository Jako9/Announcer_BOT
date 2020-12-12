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
        if($action == 'reload-debug-log'){
            
            $resp = array();
            $resp['debugLog'] = readLogFile("debug.log");
            echo json_encode($resp);
        }elseif($action == 'reload-boot-log'){
            $resp = array();
            $resp['bootLog'] = readLogFile("boot_log.log");
            echo json_encode($resp);
        }elseif($action == 'reload-error-log'){
            $resp = array();
            $resp['errorLog'] = readLogFile("error_log.log");
            echo json_encode($resp);
        }
    }
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