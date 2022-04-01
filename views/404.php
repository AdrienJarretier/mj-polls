<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'partials/head.php' ?>
</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include 'partials/header.php' ?>

<div class="row">
    <div class="col">

        <?php
        $files404avail = scandir(__DIR__ . '/404Contents');
        include __DIR__ . '/404Contents/' . $files404avail[rand(2, count($files404avail) - 1)];
        ?>

    </div>
</div>

<p>
    Ascii Art généré avec <a class="link-info" href="https://guillaume-gomez.github.io/image-to-ascii/">https://guillaume-gomez.github.io/image-to-ascii/</a>
</p>

<!-- Includes Body and container closing tags as well as <footer> -->
<?php include 'partials/footer.php' ?>

</html>