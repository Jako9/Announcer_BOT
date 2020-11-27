<?php


function run() {
    global $rawInput;

    $postBody = $_POST['payload'];
    $payload = json_decode($postBody);

    if ($payload->repository->url == 'https://github.com/Jako9/Announcer_BOT' && $payload->ref == 'refs/heads/master') {

        shell_exec('cd /home/fkoehler/bot/');
        shell_exec('git pull');
        
        return true;
    }
    
}

try {
    if (!isset($_POST['payload'])) {
        $homepage = file_get_contents('webpage.html');
        echo $homepage;
    } else {
        run();
    }
} catch ( Exception $e ) {
    $msg = $e->getMessage();
    mail($error_mail, $msg, ''.$e);
}
