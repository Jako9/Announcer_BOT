<?php
session_start();

if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] != true){
    header("location: login.php");
    exit;
}

$shutdownButtonColor = "";
$statusColor = "";
$red = "#ff3a30";
$green = "#34c74f";
$shutDownButtonAction = "boot";
$restartButton = "";
$statusText = "";

handleLogReset();

handleNodeServerActions();

if(isServerRunning()) {
    $shutdownButtonColor = $red;
    $statusColor = $green;
    $shutDownButtonAction = "boot";
    $statusText = "Online";
    
    $shutDownButton = '<button type="Button" class="action-button" name="shutdown" data-toggle="modal" data-target="#staticBackdrop-shutdown">';
    $restartButton = '<button type="Button" class="action-button restart-button" name="restart" data-toggle="modal" data-target="#staticBackdrop-restart"><i class="action-icon fas fa-redo restart"></i></button> ';
}else{
    $shutdownButtonColor = $green;
    $statusColor = $red;
    $shutDownButtonAction = "shutdown";
    
    $shutDownButton = '<button type="submit" class="action-button" name="shutdown">';
    $restartButton = '<button type="Button" class="action-button restart-button" name="restart" data-toggle="modal" data-target="#staticBackdrop-restart" hidden><i class="action-icon fas fa-redo restart"></i></button>';
    $statusText = "Offline";
}


function printServer(){
    $files = preg_grep('/^([^.])/', scandir('../../../config/guilds'));
    $i = 0;

    $servers = getServersFromDatabase();

    $defaultSettings = readFromJSON('../template.json');

    echo (print_r($servers, true));
}


function printVips(){
    $i = 0;

    $vips = getVipsFromDatabase();

    if(count($vips) > 0){
        foreach($vips as $vip) {

            $id = $vip['userID'];
            $name = $vip['username'];
            $vipAvatar = $vip['avatar'];
    
            $vipStyle = ($vipAvatar != "")? "background-image: url(". $vipAvatar .")" : "background-color: white";
    
            echo('
                <div class="vip-element">
                    <div class="card mb-3" style="max-width: 18rem;">
                        <div class="card-header">
                            <div class="vip-avatar" style="'. $vipStyle .'">
    
                            </div>
                            <div class="vip-name">
                                '. $name .'
                            </div>
                        </div>
                        <div class="card-body text-dark">
                        <div class="card-text vip-sound-card">
                            <i class="fas fa-volume-up sound-icon" id="sound-button-'. $i .'" data-id="'. $id .'"></i>
                        </div>
                        </div>
                    </div>
                </div>
            ');
            $i++;
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

function clearLogFile($file){
    $logPath = '../../../logs/' . $file;
    file_put_contents($logPath, "");
}

function connectToDatabase(){
    $creds = readFromJSON('../database.json');
    $username = $creds->user;
    $password = $creds->password;
    $database = $creds->database;

    $conn = new mysqli('localhost', $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function getVipsFromDatabase(){
    $connection = connectToDatabase();
    $sql = "SELECT userID, username, avatar FROM users WHERE isVip=1";

    $result = $connection->query($sql);
    $arr = array();

    if($result){
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($arr, $row);
        }
    }

    return $arr;
    $connection->close();
}

function getServersFromDatabase(){
    $connection = connectToDatabase();
    $sql = "SELECT server.*, GROUP_CONCAT(instructions.name) AS instructions FROM `server`, `instructions`  WHERE server.guildID =instructions.ServerID GROUP BY server.guildID";

    $result = $connection->query($sql);
    $arr = array();

    if($result){
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($arr, $row);
        }
    }

    return $arr;
    $connection->close();
}

function printActions(){
    echo("");
}

function readFromJSON($file){
    $json = file_get_contents('../../../config/guilds/' . $file);
    return json_decode($json);
}

function isServerRunning(){
    exec("pgrep node", $pids);
    return !(empty($pids));
}

function handleNodeServerActions(){
    if(isset($_POST['shutdown'])){
        if(isServerRunning()) {
            $out = [];
            exec("../../../shutdown.sh >/dev/null &", $out);
            header("Refresh:0");
    
        }else{
            $out = [];
            exec("../../../launch.sh >/dev/null &", $out);
            header("Refresh:0");
        }
    }
    
    if(isset($_POST['restart'])){
        $out = [];
        exec("../../../restart.sh >/dev/null &", $out);
        header("Refresh:0");
    }
}

function handleLogReset(){
    if(isset($_POST['reset-error-log'])){
        clearLogFile('error_log.log');
    }

    if(isset($_POST['reset-boot-log'])){
        clearLogFile('boot_log.log');
    }

    if(isset($_POST['reset-debug-log'])){
        clearLogFile('debug.log');
    }
}


function getStatistics(){
    $json = file_get_contents('../../../config/statistics/statistics.json');
    $stats = json_decode($json);

    $timeInMilliSeconds = $stats->totalPlaytime;

    $timeInSeconds = $timeInMilliSeconds / 1000;

    $rest = ($timeInSeconds % (60*60*24));
    $timeInDays = floor(($timeInSeconds / (60*60*24)));

    $daysString = "";

    if($timeInDays == 1){
        $daysString = " Tag ";
    }else{
        $daysString = " Tage ";
    }

    echo ('
    <div class="totalPlayTime stat-object">
        <h3 class="stat-title">Gesamtspielzeit</h3>
        <h3 class="stat-value">' . $timeInDays . $daysString . gmdate("H:i:s", $rest) . '</h3>
        <p class="stat-description">Die Gesamte Zeit, die der Bot mit abspielen von Sounddateien beschäftigt war</p>
    </div>
    <div class="totalTimesJoined stat-object">
        <h3 class="stat-title">Serverbeitritte</h3>
        <h3 class="stat-value">' . $stats->timesJoined . '</h3>
        <p class="stat-description">Anzahl der Beitritte über alle Server</p>
    </div>
    <div class="timesRickrolled stat-object">
        <h3 class="stat-title">Rick-Rolls</h3>
        <h3 class="stat-value">' . $stats->timesRickroll . '</h3>
        <p class="stat-description">Wie oft beim Joinen Never gonna give you Up abgespielt wurde.</p>
    </div>
    ');
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
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>

    <link rel="stylesheet" href="http://announcer.jmk.cloud/weboverlay/app/public/overlay.css">

    <link rel="shortcut icon" type="image/ico" href="http://announcer.jmk.cloud/weboverlay/app/public/favicon.ico"/>

    <title>Announcer_Bot Admin</title>
    </head>
    <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
        <i class="fas fa-microphone" id="mic"></i>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse main-nav" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#server">Server</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#vips">VIPs</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#logs">Logs</a>
            </li>
        </ul>
        <form method="post">
            <ul class="navbar-nav">
            <li class="nav-item action-item">
                <?php echo $restartButton ?>
            </li>
            <li class="nav-item action-item">
                <?php echo $shutDownButton ?>
                    <i class="action-icon fas fa-power-off off" style="color: <?php echo $shutdownButtonColor ?>"></i>
                </button>
            </li>

            <div class="modal fade" id="staticBackdrop-restart" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel-restart">Neustarten</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Soll der Bot wirklich neugestartet werden?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Abbrechen</button>
                    <input type="submit" class="btn btn-danger" id="restart" name="restart"  value="Neustarten">
                </div>
                </div>
            </div>
            </div>

            <div class="modal fade" id="staticBackdrop-shutdown" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel-shutdown">Herunterfahren</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    Soll der Bot wirklich heruntergefahren werden?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Abbrechen</button>
                    <input type="submit" class="btn btn-danger" id="shutdown" name="shutdown"  value="Herunterfahren">
                </div>
                </div>
            </form>
        </div>
        
        </div>
    </nav>

    <!--Beginn Home-->
    <div id="home" class="d-board-card">
        <div class="container-fluid">
        <div class="card">
            <div class="card-header home-card-header">
                <div class="home-header-text" >
                    <h5>Home</h5>
                </div>
                <div class="home-header-status">
                    <div class="home-status" style="background-color: <?php echo $statusColor  ?>"></div>
                    <h6 class="home-status-text"><?php echo $statusText ?></h6>
                </div>
            </div>
            <div class="card-body">
            <div class="card-text server-body">
            <div class="accordion" id="accordionExample">
                
                <div class="stats">
                    <h4 class="stats-headline">Statistik</h4>
                    <div class="stats-values">
                        <?php getStatistics() ?>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
        </div>
    </div>
    <!--Ende Home-->
    
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

    <!--Beginn VIP Abschnitt-->
    <div id="vips" class="d-board-card">
        <div class="container-fluid">
        <div class="card">
            <h5 class="card-header">VIPs</h5>
            <div class="card-body">
            <div class="card-text server-body">
            <div class="accordion" id="accordionExample">

                <div class="vip-container">
                    <?php printVips() ?>
                </div>
            
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
    <!--Ende VIP -->

    <!--Beginn Server Abschnitt-->
    <div id="logs" class="d-board-card">
        <div class="container-fluid">
        <div class="card">
            <h5 class="card-header">Logs</h5>
            <div class="card-body">
            <div class="card-text server-body">
            <h5 class="log-title">Error Log</h5>
            <div class="accordion accordion-log" id="accordionExample">

                <div class="log-viewer" id="error-log-viewer">
                    <?php echo readLogFile("error_log.log") ?>
                </div>
                <div class="log-actions">
                    <form method="post">
                        <button type="Button" class="btn btn-secondary reload-log-button" id="reload-error">Aktualisieren</button>
                        <button type="Button" class="btn btn-secondary" id="reset-error-log" name="reset-error-log">Log zurücksetzen</button>
                    </form>
                </div>
            </div>
            <hr>
            <h5 class="log-title">Boot Log</h5>
            <div class="accordion accordion-log" id="accordionExample">

                <div class="log-viewer" id="boot-log-viewer">
                    <?php echo readLogFile("boot_log.log") ?>
                </div>
                <div class="log-actions">
                    <form method="post">
                        <button type="Button" class="btn btn-secondary reload-log-button" id="reload-boot">Aktualisieren</button>
                        <button type="Button" class="btn btn-secondary" id="reset-boot-log" name="reset-boot-log">Log zurücksetzen</button>
                    </form>
                </div>
            </div>
            <hr>
            <h5 class="log-title">Debug Log</h5>
            <div class="accordion accordion-log" id="accordionExample">

                <div class="log-viewer" id="debug-log-viewer">
                    <?php echo readLogFile("debug.log") ?>
                </div>
                <div class="log-actions">
                    <form method="post">
                        <button type="Button" class="btn btn-secondary reload-log-button" id="reload-debug" >Aktualisieren</button>
                        <button type="Button" class="btn btn-secondary" id="reset-debug-log" name="reset-debug-log">Log zurücksetzen</button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    </div>
        </div>
    </div>
    <!--Ende Server -->
    

    <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>

    <script type='text/javascript' src="http://announcer.jmk.cloud/weboverlay/app/public/script.js"></script>
    </body>
    </html>


