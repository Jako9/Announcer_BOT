<?php
session_start();
 

if(isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true){
    header("location: index.php");
    exit;
}

if(isset($_POST['login'])){
    if(isset($_POST['user']) && isset($_POST['password'])){
        $user = $_POST['user'];
        $password = $_POST['password'];

        $validPassword = password_verify($password, $_ENV['PASSWORD']); //Hier noch richtiges hashing implementieren
        $validUser = ($_ENV['LOGIN'] == $user);


        if($validPassword && $validUser){
             $_SESSION["loggedin"] = true;
             $_SESSION["username"] = $username;                            
            
             header("location: index.php");
        }
    }
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
    </head>
    <body>
    

    <div class="login-container">
        <div id="login" class="d-board-card">
            <div class="container-fluid">
            <div class="card">
                <div class="card-header home-card-header">
                    <div class="home-header-text" >
                        <h5>Login <?php echo password_hash('admin', PASSWORD_DEFAULT); ?></h5>
                    </div>
                </div>
                <div class="card-body">
                <div class="card-text server-body">
                <div class="accordion" id="accordionExample">
                    <form method="post">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Username</label>
                            <input type="text" class="form-control" id="user" aria-describedby="emailHelp" name="user">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="password" name="password">
                        </div>
                        <button type="submit" class="btn btn-primary" id="login" name="login">Submit</button>
                    </form>
                </div>
            </div>
            </div>
        </div>
            </div>
        </div>
    
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>

    <script type='text/javascript' src="script.js"></script>
    </body>
    </html>