<?php


function printServer(){
    $files = preg_grep('/^([^.])/', scandir('../../../config/guilds'));
    $i = 0;
    foreach($files as $file) {
        if($file !== '.' || $file !== '..'){

            $jObj = readFromJSON($file);

            if(isset($_POST['submit-server-settings-' . $i])){
                $pObj = new stdClass();

                $pObj = $jObj;

                for($j=0; $j < sizeof($pObj->instructions); $j++){
                    if(isset($_POST['instruction-input-'. $i . "-" . $j])){
                        $r = $_POST['instruction-input-'. $i . "-" . $j];
                        if(strlen($r) >= 1){
                            $pObj->instructions[$j] = $r;
                        }
                    } 
                }

                if(isset($_POST['volume-range-'. $i])){
                    $val = $_POST['volume-range-'. $i];
                    if($val <= 1 && $val >= 0){
                        $pObj->volume = $val;
                    }
                }


                if(isset($_POST['prefix-char-'. $i])){
                    $val = $_POST['prefix-char-'. $i];
                    
                    if(strlen($val) == 1){
                        $pObj->prefix = $val;
                    }
                }

                $jToWrite = json_encode($pObj);
                file_put_contents('../../../config/guilds/' . $file, $jToWrite);

            }

            $serverStyle = ($jObj->avatar != "")? "background-image: url(". $jObj->avatar .")" : "background-color: white";

            $instructions = "";

            $j = 0;
            foreach($jObj->instructions as $instruction){

                $instructions .= '<div><input class="server-settings-input-disabled instruction-input instruction-input-'. $i . '" id="instruction-input-'. $i . "-" . $j . '" name="instruction-input-'. $i . "-" . $j . '" value="'. $instruction .'" disabled><i class="fas fa-pencil-alt" id="edit-instructions-'. $i . "-". $j .'"></i></div>';
                //$instructions .= $instruction . "<br>";
                $j++;
            }

            echo('
            <div class="card">
                    <div class="card-header" id="headingOne">
                        <div class="card-serverpic" style="'. $serverStyle .'"></div>
                        <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left" id="colapse-button-header-'. $i .'"  type="button" data-toggle="collapse" data-target="#collapse-'. $i .'" aria-expanded="true" aria-controls="collapse-'. $i .'">
                                '. $jObj->name. '
                            </button>
                        </h2>
                        </div>

                        <div id="collapse-'. $i .'" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body">
                            <div class="half-container">
                                <div class="server-settings server-roles">
                                    <h3 class="setting-title">Rolle</h3>
                                    <div class="setting-ist">
                                        <input id="standard-role-'. $i .'" name="standard-role-'. $i .'" class="server-settings-input-disabled" value="'. $jObj->rolle .'" disabled>
                                    </div>
                                <i class="role-edit-button fas fa-pencil-alt" data-toggle="modal" data-target="#roles-modal-'. $i .'" id="edit-role-'. $i .'"></i>
                                </div>
                                <div class="server-settings server-instructions">
                                    <h3 class="setting-title">Instruktionen</h3>
                                    <div class="setting-ist">
                                        <div class="array-box instruction-editor">
                                            '. $instructions .'
                                        </div>
                                    </div>
                                </div>
                                <div class="server-settings server-prefix">
                                    <h3 class="setting-title">Prefix</h3>
                                    <div class="setting-ist">
                                        <input id="prefix-char-'. $i .'" name="prefix-char-'. $i .'" class="server-settings-input-disabled" value="'. $jObj->prefix .'" maxlength="1" disabled>
                                    </div>
                                    <i class="prefix-edit-button fas fa-pencil-alt" data-toggle="modal" data-target="#prefix-modal-'. $i .'" id="edit-prefix-'. $i .'"></i>
                                </div>
                                <div class="server-settings server-volume">
                                    <h3 class="setting-title">Volume</h3>
                                    <div class="setting-ist">
                                        <input type="range" id="volume-range-'. $i .'" name="volume-range-'. $i .'" min="0" max="1" value="' . $jObj->volume . '" step="0.1" disabled>
                                        <div id="range-val-'. $i .'" class="range-val"></div>
                                    </div>
                                    <i class="volume-edit-button fas fa-pencil-alt" id="edit-volume-'. $i .'"></i>
                                </div>
                                <input type="submit" id="submit-server-settings-'. $i .'" name="submit-server-settings-'. $i .'" class="btn btn-success" value="Speichern">
                            </div>
                        </div>
                    </div>
                </div>

                
                
        ');
        $i++;
        }
    }
}

function readFromJSON($file){
    $json = file_get_contents('../../../config/guilds/' . $file);
    return json_decode($json);
}

?>



    <!doctype html>
    <html>
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>

    <link rel="stylesheet" href="overlay.css">
    </head>
    <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
        <i class="fas fa-microphone" id="mic"></i>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Actions</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Server</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#logs">VIPs</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#logs">Logs</a>
            </li>
        </ul>
        </div>
    </nav>

    <!--Beginn Home-->
    <div id="home">
        <div class="container-fluid">

        </div>
    </div>
    <!--Ende Home-->

    <!--Beginn Actions-->
    <div id="actions">
        <div class="container-fluid">
        <div class="card">
            <h5 class="card-header">Actions</h5>
            <div class="card-body">
            <h5 class="card-title">Admin-Actions</h5>
            <div class="card-text action-body">
                
            </div>
            </div>
        </div>
        </div>
    </div>
    <!--Ende Actions-->
    
    <!--Beginn Server Abschnitt-->
    <div id="server" class="d-board-card">
        <div class="container-fluid">
        <div class="card">
            <h5 class="card-header">Server</h5>
            <div class="card-body">
            <div class="card-text server-body">
            <div class="accordion" id="accordionExample">

                <form method="post">
                    <?php printServer() ?>
                </form>
            
            </div>
        </div>
        </div>
    </div>
        </div>
    </div>
    <!--Ende Server -->

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
    
    <script type='text/javascript' src="script.js"></script>
    </body>
    </html>


