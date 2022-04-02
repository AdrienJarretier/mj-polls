<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

<title>
    <?php
    if (isset($pageOptions['pageTitle']))
        echo $pageOptions['pageTitle'];
    ?>
</title>

<link rel="stylesheet" href="/extLibs/bootstrap-5.0.2-dist/css/bootstrap.min.css">


<script src="/extLibs/jquery-3.4.1.min.js"></script>

<script src="/extLibs/popper-2.9.3.min.js"></script>
<script src="/extLibs/bootstrap-5.0.2-dist/js/bootstrap.min.js"></script>


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
if (isset($poll)) {

    // Common::log($_REQUEST[''],true);
    // Common::log($poll->choices[0]->votes, true);

    $og['title'] = $poll->title;

    if (isset($poll->choices[0]->votes)) {
        $og['description'] = 'View results of <<' . $poll->title . '>>';
    } else {
        $og['description'] = 'Vote on <<' . $poll->title . '>>';
    }

    // $og['description'] = '$poll->title';
}
echo '<meta property="og:title" content="' . $og['title'] . '" />';
echo '<meta property="og:site_name" content="' . $og['title'] . '" />';
echo '<meta property="og:description" content="' . $og['description'] . '" />';
echo '<meta name="description" content="' . $og['description'] . '">';

?>

<meta property="og:image" content="https://vote.sirtak.fr/images/favicon96.png" />