<?php include('partials/head.php') ?>

<script>
    'use strict';

    const parsedPoll = JSON.parse('<?= json_encode($pageOptions['poll'], JSON_HEX_APOS) ?>');
</script>

<script src="/extLibs/chart.js/chart.js-3.5.1.min.js"></script>
<script src="/extLibs/chart.js/chartjs-plugin-annotation-1.0.2.min.js"></script>

<script type="module">
    'use strict';

    import plot_results from '/javascripts/results_page.js';
    import {
        LocaleMessages
    } from '/javascripts/LocaleMessages.js';

    const localeMsgs = await LocaleMessages.new('client-pollResults');
    const localeGrades = await LocaleMessages.new(
        'db-grades');

    $(function() {
        plot_results(localeMsgs, localeGrades);

        $('#candidateDetailsTitle').text(localeMsgs.get('candidateDetails').get('title'));
    })
</script>


</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include('partials/header.php') ?>

<div class="row">
    <div class="col">

        <div class="row mb-1">
            <div class="col">
                <h1 id="title" class="fs-3"></h1>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="alert alert-success shadow-md py-1 mb-0 rounded" role="alert" id="results_alert">
                    <p class="my-0">
                        <i class="bi-trophy-fill me-2" role="img" style="font-size:1.5em;"></i><span id="results_alert_text"> </span>
                    </p>
                </div>
            </div>
        </div>

        <div class="row mt-1">
            <div class="col-lg-9 vh-80">
                <canvas id="results_plot"></canvas>
            </div>
        </div>

    </div>
</div>

<div class="row">
    <div class="col">

        <div class="row">
            <div class="col">
                <hr>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <h2 class="fs-3" id="candidateDetailsTitle">Details for each candidate</h2>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <form id="formRadiosCandidate_selection">
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group" id="Candidate_choice">
                    </div>
                </form>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div style="height:720px; width:415px">
                    <canvas id="results_per_candidate"></canvas>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- Includes Body and container closing tags as well as <footer> -->
<?php include('partials/footer.php') ?>

</html>