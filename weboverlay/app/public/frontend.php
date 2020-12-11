<?php

    function isOnline(){
        exec("pgrep node", $pids);
        return !empty($pids);
    }

    function getOnlineColor(){
        $green = "#34c74f";
        $red = "#ff3a30";
        $color = $red;

        if(isOnline()){
            $color = $green;
        }else{
            $color = $red;
        }

        echo $color;
    }

    function getOnlineText(){
        $text = "Offline";

        if(isOnline()){
            $text = "Online";
        }else{
            $text = "Offline";
        }

        echo $text;
    }

    function getStatistics(){
    $json = file_get_contents('../../../config/statistics/statistics.json');
    $stats = json_decode($json);

    $timeInMilliSeconds = $stats->totalPlaytime;

    $rest = ($timeInMilliSeconds % (1000*60*60*24));
    $timeInDays = floor(($timeInMilliSeconds / (1000*60*60*24)));

    $daysString = "";

    if($timeInDays == 1){
        $daysString = " Tag ";
    }else{
        $daysString = " Tage ";
    }

    echo ('
    <div class="col-sm centered-column">
        <h3 class="stat-title">Gesamtspielzeit</h3>
        <h3 class="stat-value">' . $timeInDays . $daysString . gmdate("H:i:s", $rest) . '</h3>
        <p class="stat-description">Die Gesamte Zeit, die der Bot mit abspielen von Sounddateien beschäftigt war</p>
    </div>
    <div class="col-sm centered-column">
        <h3 class="stat-title">Serverbeitritte</h3>
        <h3 class="stat-value">' . $stats->timesJoined . '</h3>
        <p class="stat-description">Anzahl der Beitritte über alle Server</p>
    </div>
    <div class="col-sm centered-column">
        <h3 class="stat-title">Rick-Rolls</h3>
        <h3 class="stat-value">' . $stats->timesRickroll . '</h3>
        <p class="stat-description">Wie oft beim Joinen Never gonna give you Up abgespielt wurde.</p>
    </div>
    ');
}
?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
    
    <link rel="stylesheet" href="./overlay.css">

    <title>Hello, world!</title>

    <link rel="shortcut icon" type="image/ico" href="favicon.ico"/>
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
                <a class="nav-link" href="#features">Features</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#documentation">Documentation</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#statistics">Statistics</a>
            </li>
        </ul>
        <ul class="online-status navbar-nav">
            <li class="nav-item online-status-li">
                <div class="status-circle" style="background-color: <?php echo getOnlineColor() ?>"></div>
                <p class="status-text"><?php echo getOnlineText() ?></p>
            </li>
        </ul>
        </div>
        </div>
    </nav>
  </head>
  <body>
    <div class="jumbotron jumbotron-fluid">
    <div class="container" id="stage">
        <i class="fas fa-microphone" id="stage-mic"></i>
        <h1 class="display-4" id="stage-title">Announcer Bot</h1>
        <p class="lead">Your Discord server is very quiet? Your always dreamed of some cool announcement sound while joining? Hold up and invite this fine Bot.</p>
        <a class="ich-hasse-links" href="https://discord.com/api/oauth2/authorize?client_id=541676543525519360&permissions=8&scope=bot">
            <div class="discord-container">
                <i class="fab fa-discord discord-icon"></i>
                <h2 class="invite-text">Invite Bot</h2>
            </div>
        </a>
    </div>
    </div>
    <div class="container-fluid features" id="features">
        <div class="features-block">
            <h2 class="feature-headline">Features</h2>
            <div class="row feature-row">
                <div class="col-sm centered-column">
                    <i class="fas fa-volume-up feature-icon"></i>
                    <h3 class="feature-text">Join-Announcement</h3>
                    <p class="feature-explanation">When you join to a channel on your server the bot will play an announcement-sound automaticly.</p>
                </div>
                <div class="col-sm centered-column">
                    <i class="fas fa-comments feature-icon"></i>
                        <h3 class="feature-text">Role-Via-Reaction</h3>
                    <p class="feature-explanation">Do you want to let your fellow Users choose roles by themself without them having managing permission? This bot provides you with the optimal soluion as the User can simply react to a predetermined message and recieve their desired role automatically!</p>
                </div>
                <div class="col-sm centered-column">
                    <i class="fas fa-lock feature-icon"></i>
                        <h3 class="feature-text">Channel-Lock</h3>
                    <p class="feature-explanation">Have you ever wanted to exclude an annoying colleague from your channel? Get ready for this feature. Just tell the bot to lock your current channel and enjoy some peace.</p>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid documentation" id="documentation">
            <h2 class="documentation-headline">Documentation</h2>
            <i class="fab fa-youtube documenation-icon"></i>
            <p class="lead">You are looking for a functionallity? Head over to our YouTube channel and watch one of our tutorials. </p>
    </div>
    <div class="container-fluid statistics" id="statistics">
        <div class="statistics-block">
            <h2 class="feature-headline">Statistics</h2>
            <div class="row feature-row">
                <?php getStatistics() ?>
            </div>
        </div>
    </div>
    

    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: jQuery and Bootstrap Bundle (includes Popper) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>


    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>
 
  </body>
</html>