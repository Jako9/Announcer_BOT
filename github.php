<?php


function run() {
    global $rawInput;

    $postBody = $_POST['payload'];
    $payload = json_decode($postBody);

    if ($payload->repository->url == 'https://github.com/Jako9/Announcer_BOT' && $payload->ref == 'refs/heads/master') {

        shell_exec("killall node");
        //shell_exec("git pull");
        shell_exec("./restart.sh");
        
        return true;
    }

}

try {
    if (!isset($_POST['payload'])) {
        $page = '';

        $page = file_get_contents('./web/status/status.html');
        $page = str_replace("\\", "", $page);

        $color = "";
        $red = "#ff3a30";
        $green = "#34c74f";

        $status = "";

        exec("pgrep node", $pids);
        if(empty($pids)) {
            $color = $red;
            $status = "offline";
        }else{
            $color = $green;
            $status = "online";
        }

        echo sprintf($page, $color, $status);
    } else {
        run();
    }
} catch ( Exception $e ) {
    $msg = $e->getMessage();
    mail($error_mail, $msg, ''.$e);
}
