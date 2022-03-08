<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'partials/head.php' ?>
</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include 'partials/header.php' ?>

<div class="row">
    <div class="col">
        <h1>Not Found</h1>

        <?php
        echo 'Error 404 :-(<br>';
        echo 'The requested path "' . $path . '" was not found!';
        ?>
    </div>
</div>

<!-- Includes Body and container closing tags as well as <footer> -->
<?php include 'partials/footer.php' ?>

</html>