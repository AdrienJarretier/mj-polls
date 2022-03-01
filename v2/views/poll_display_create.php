<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<!DOCTYPE html>
<html>

<head>
    <?php require_once 'partials/head.php' ?>

    <script>
        'use strict';

        $(function() {

            // <?php
            // $recentPolls = [];
            // ?>

            const recentPolls = JSON.parse('<?= $recentPolls ?>');

            // console.log(recentPolls);

            for (const poll of recentPolls) {

                let pollPreviewTemplate = $('#pollPreviewTemplate')[0].content;

                let cloned = $(pollPreviewTemplate.cloneNode(true));

                let href = cloned.children().children().children().attr('href');

                cloned.children().children().children().attr('href', href + poll.uuid);
                cloned.children().children().children().text(poll.title);

                $('#mostRecent').append(cloned);
            }

        });
    </script>
</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php require_once('partials/header.php') ?>

<div class="row">

    <div class="col" id="mostRecent"></div>

</div>

<!-- Includes Body and container closing tags as well as <footer> -->
<?php require_once('partials/footer.php') ?>

</html>

<template id="pollPreviewTemplate">

    <div class="row">

        <div class="col">

            <a href="poll/">title</a>

        </div>

    </div>

</template>