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

    $timeInSeconds = $timeInMilliSeconds / 1000;

    $rest = ($timeInSeconds % (60*60*24));
    $timeInDays = floor(($timeInSeconds / (60*60*24)));

    $daysString = "";

    if($timeInDays == 1){
        $daysString = " Day ";
    }else{
        $daysString = " Days ";
    }

    echo ('
    <div class="col-sm centered-column">
        <h3 class="stat-title">Total time played</h3>
        <h3 class="stat-value">' . $timeInDays . $daysString . gmdate("H:i:s", $rest) . '</h3>
        <p class="stat-description">The total playtime of the soundfiles the bot played.</p>
    </div>
    <div class="col-sm centered-column">
        <h3 class="stat-title">Times joined</h3>
        <h3 class="stat-value">' . $stats->timesJoined . '</h3>
        <p class="stat-description">The total count of server joins.</p>
    </div>
    <div class="col-sm centered-column">
        <h3 class="stat-title">Rick-Rolls</h3>
        <h3 class="stat-value">' . $stats->timesRickroll . '</h3>
        <p class="stat-description">How many times the bot played never gonna give you up.</p>
    </div>
    ');
}
?>

<!doctype html>
<html lang="en" style="scroll-behavior: smooth;">
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
    
    <link rel="stylesheet" href="http://announcer.jmk.cloud/weboverlay/app/public/overlay.css">

    <title>Announcer_Bot</title>

    <link rel="shortcut icon" type="image/ico" href="http://announcer.jmk.cloud/weboverlay/app/public/icon.svg"/>
    </head>
    <body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">
        <span class="custom-nav-mic" id="mic"></span>
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
                <a class="nav-link" href="#help">Help</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#statistics">Statistics</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" data-toggle="modal" data-target="#staticBackdrop-impressum">Impressum</a>
            </li>

            <div class="modal fade" id="staticBackdrop-impressum" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel-impressum">Impressum</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <h1>Impressum</h1>
                    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
                    <p>Florian K&ouml;hler<br />
                    Im Streitfeld 9<br />
                    44339 Dortmund</p>

                    <h2>Kontakt</h2>
                    <p>Telefon:+49 173 8215472<br />
                    E-Mail: flomail808384@web.de</p>

                    <h3>Haftung f&uuml;r Inhalte</h3> <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.</p> <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unber&uuml;hrt. Eine diesbez&uuml;gliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung m&ouml;glich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p> <h3>Haftung f&uuml;r Links</h3> <p>Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf m&ouml;gliche Rechtsverst&ouml;&szlig;e &uuml;berpr&uuml;ft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.</p> <p>Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p> <h3>Urheberrecht</h3> <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes bed&uuml;rfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur f&uuml;r den privaten, nicht kommerziellen Gebrauch gestattet.</p> <p>Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.</p>

                    <p>Quelle: <a href="https://www.e-recht24.de">https://www.e-recht24.de</a></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Ok</button>
                </div>
                </div>
            </div>
            </div>
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
        <span id="stage-mic"></span>
        <h1 class="display-4" id="stage-title">Announcer Bot</h1>
        <p class="lead">Your Discord server is very quiet? You always dreamed of some cool announcement sound while joining? Hold up and invite this bot.</p>
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
                    <p class="feature-explanation">When you join to a channel on your server the bot will play an announcement-sound automatically. Become a VIP for a custom sound!</p>
                </div>
                <div class="col-sm centered-column">
                    <i class="fas fa-comments feature-icon"></i>
                        <h3 class="feature-text">Role-Via-Reaction</h3>
                    <p class="feature-explanation">Do you want to distribute roles among your users? This bot provides you with the optimal soluion, so that user can simply react to a message and recieve their desired role automatically!</p>
                </div>
                <div class="col-sm centered-column">
                    <i class="fas fa-lock feature-icon"></i>
                        <h3 class="feature-text">Channel-Lock</h3>
                    <p class="feature-explanation">Need some privacy? Just tell the bot to lock your current channel and enjoy some private moments.</p>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid documentation" id="help">
            <h2 class="documentation-headline">Help</h2>
            <a href="https://github.com/Jako9/Announcer_BOT/wiki/home"><i class="fab fa-github documenation-icon"></i></a>
            <p class="lead">You want to <a href="https://github.com/Jako9/Announcer_BOT/wiki/setup">setup</a> the bot for your server or you need an <a href="https://github.com/Jako9/Announcer_BOT/wiki/usage">explanation</a>? Then refer to the 'help' command, or head over to the <a href="https://github.com/Jako9/Announcer_BOT/wiki/">github wiki</a>. </p>
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