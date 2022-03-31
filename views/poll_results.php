<!DOCTYPE html>
<html lang="en">

<head>
<?php include('partials/head.php') ?>

        <script>

            'use strict';

            const parsedPoll = JSON.parse('<?= json_encode($pageOptions['poll'], JSON_HEX_APOS) ?>');

        </script>

        <script src="/extLibs/chart.js/chart.js-3.5.0.min.js"></script>
        <script src="/extLibs/chart.js/chartjs-plugin-annotation-1.0.2.min.js"></script>

        <script type="module">
            'use strict';

            import plot_results from '/javascripts/plot_results.js';
            import { LocaleMessages } from '/javascripts/LocaleMessages.js';

            const localeMsgs = await LocaleMessages.new('client-pollResults', 'fr-FR');

            $(function () {
                plot_results(localeMsgs);
            })

        </script>


</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include('partials/header.php') ?>

    <div class="row">

        <div class="col">

            <h1 id="title"></h1>

            <br>

            <div class="alert alert-success shadow-md p-3 mb-5 rounded" role="alert" id="results_alert">

                <p class="fs-4"> <i class="bi-trophy-fill" role="img" aria-label="GitHub"
                        style="font-size:32px;"></i><span id="results_alert_text"> </span> </p>
            </div>

            <div class="col w-100 vh-80">

                <canvas id="results_plot"></canvas>

            </div>

        </div>

    </div>

    <hr>

    <div class="row">

        <h1>Details for each candidate</h1>
        <br>

        <div class="row">

            <br>

            <br>

            <form id="formRadiosCandidate_selection">
                <div class="btn-group position-relative top-50 start-50 translate-middle" role="group"
                    aria-label="Basic radio toggle button group" id="Candidate_choice">

                </div>
            </form>

        </div>

        <br>

        <div class="row">

            <canvas id="results_per_candidate"></canvas>

        </div>
    </div>

    <!-- Includes Body and container closing tags as well as <footer> -->
    <?php include('partials/footer.php') ?>

</html>