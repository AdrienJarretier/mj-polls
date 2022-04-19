<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<title>
    <?php
    $lang = getLang();
    if ($lang == 'fr')
        echo 'Sondage JM';
    else
        echo 'MJ Poll';
    if (isset($pageOptions['pageTitle']))
        echo ' - ' . $pageOptions['pageTitle'];
    ?>
</title>

<link rel="stylesheet" href="/extLibs/bootstrap-5.0.2-dist/css/bootstrap.min.css">


<script src="/extLibs/jquery-3.4.1.min.js"></script>

<script src="/extLibs/popper-2.9.3.min.js" defer></script>
<script src="/extLibs/bootstrap-5.0.2-dist/js/bootstrap.min.js" defer></script>


<link rel="stylesheet" href="/stylesheets/style.css" />

<link rel="stylesheet" href="/extLibs/bootstrap-icons/font/bootstrap-icons.css">
</link>

<link rel="icon" href="/images/favicon96.png">

<link rel="apple-touch-icon" sizes="96x96" href="/images/favicon96.png">



<meta property="og:url" content="https://vote.sirtak.fr/">
<?php

$og = [
    'title' => 'Create a majority judgment poll',
    'description' => 'Create and share majority judgment polls'
];

if ($lang == 'fr') {
    $og['title'] = 'Créer un sondage au jugement majoritaire';
    $og['description'] = 'Créer et partager des sondages au jugement majoritaire';
}

if (isset($poll)) {

    // Common::log($_REQUEST[''],true);
    // Common::log($poll->choices[0]->votes, true);

    $og['title'] = $poll->title;

    if (isset($poll->choices[0]->votes)) {
        $og['description'] = 'View results for << ' . $poll->title . ' >>';
        if ($lang == 'fr')
            $og['description'] = 'Voir les résultats pour << ' . $poll->title . ' >>';
    } else {
        $og['description'] = 'Vote on << ' . $poll->title . ' >>';
        if ($lang == 'fr')
            $og['description'] = 'Voter sur << ' . $poll->title . ' >>';
    }

    // $og['description'] = '$poll->title';
}
echo '<meta property="og:title" content="' . $og['title'] . '" />';
echo '<meta property="og:site_name" content="' . $og['title'] . '" />';
echo '<meta property="og:description" content="' . $og['description'] . '" />';
echo '<meta name="description" content="' . $og['description'] . '">';

?>

<meta property="og:image" content="https://vote.sirtak.fr/images/favicon96.png" />