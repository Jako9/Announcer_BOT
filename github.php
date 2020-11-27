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
        $page = '
            <!-- Der neue HTML Doctype ist der einfachste Doctype den es je gab.-->
            <!DOCTYPE html>
            <html lang="de">
            <head>
                <!-- Auch das meta-Tag zum Zeichensatz wurde vereinfacht.-->
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                
                <link rel="preconnect" href="https://fonts.gstatic.com">
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
            
                <style>
                    body{
                        background-color: #583d72;
            
                        font-family: "Roboto", sans-serif;
                        
                        color: white !important;
                    }
            
                    #con{
                        background-size: 170px 300px;
                        width: 200px;
                        height: 250px;
            
                        display: flex;
                        justify-content: center;
                        flex-direction: row;
                    }
            
                    #mic{
                        height: 130px;
                        width: 150px;
                        font-size: 128px;
            
                        text-align: center;
                    }
            
                    section{
                        width: 100%%;
                        height: 800px;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
            
                    #check{
                        display: flex;
                        align-items: center;
                        margin-left: 20px;
            
                        color: %s;
                    }
                </style>
            </head>
            <body>
            <main>
            <section>
                    <i class="fas fa-microphone" id="mic"></i>
                    <div style="display: flex;">
                        <h2 style="text-align: center;">Der Bot ist online!</h2>
                        <i class="fas fa-circle" id="check"></i>
                    </div>
            </section>
            </main>   
            </body>
            </html>
        ';

        $color = "";
        $red = "#ff3a30";
        $green = "#34c74f";

        exec("pgrep node", $pids);
        if(empty($pids)) {
            $color = $red;
        }else{
            $color = $green;
        }

        echo printf($page, $color);
    } else {
        run();
    }
} catch ( Exception $e ) {
    $msg = $e->getMessage();
    mail($error_mail, $msg, ''.$e);
}
