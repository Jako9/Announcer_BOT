<?php


function run() {
    global $rawInput;

    $postBody = $_POST['payload'];
    $payload = json_decode($postBody);

    if ($payload->repository->url == 'https://github.com/Jako9/Announcer_BOT' && $payload->ref == 'refs/heads/' . $_ENV['BRANCH']) {

        stopServer();
        shell_exec("git pull");
        startServer();

        return true;
    }

}

function startServer(){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://node:3000/start");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    $output = curl_exec($ch);

    $decodedAnswer = json_decode($output);

    curl_close($ch);
    
}

function stopServer(){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://node:3000/kill");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    $output = curl_exec($ch);

    $decodedAnswer = json_decode($output);

    curl_close($ch);
}