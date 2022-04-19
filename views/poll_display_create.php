<?php include('partials/head.php') ?>

<script type="module">
    'use strict';

    import {
        get
    } from '/javascripts/utils.js';

    import {
        LocaleMessages
    } from "/javascripts/LocaleMessages.js";
    let localeGrades = await LocaleMessages.new('db-grades');

    <?php if (isset($poll)) { ?>

        import {
            displayPoll
        } from "/javascripts/poll_display_create/displayPoll.js";

        const parsedPoll = JSON.parse('<?= json_encode($pageOptions['poll'], JSON_HEX_APOS) ?>');
        let infiniteVoteEnabled = JSON.parse('<?= json_encode($pageOptions['infiniteVoteEnabled']) ?>');
        // infiniteVoteEnabled = true;
        // console.log(infiniteVoteEnabled);

        const PAGE_TYPE = 'displayPoll';

    <?php } else { ?>

        import makePollCreationForm from "/javascripts/poll_display_create/makePollCreationForm.js";

        // unused for now :
        // const duplicateCheckMethods = JSON.parse('<%- duplicateCheckMethods %>');
        const duplicateCheckMethods = [];

        const PAGE_TYPE = 'createPoll';

    <?php } ?>

    const grades = await get('/polls/grades');
    grades.sort((a, b) => b.order - a.order);

    for (let grade of grades) {
        try {
            grade.value = localeGrades.get(grade.value);
        } catch (e) {
            console.error(e);
        }
    }

    $(async function() {

        const titleSize = 'fs-4';

        switch (PAGE_TYPE) {

            case 'displayPoll':

                let title = $('<h1 id="title" class="mb-0">')
                    .text(parsedPoll.title)
                    .addClass(titleSize);
                $('#titleArea').append(title);

                displayPoll(parsedPoll, infiniteVoteEnabled, grades);

                break;

            case 'createPoll':

                let localeUiTexts = await LocaleMessages.new('client-createPoll');

                let titleId = 'title';
                let placeholder = localeUiTexts.get('titlePlaceholder');
                let titleTextArea = $('<div class="form-floating">')
                    .append(
                        $('<textarea name="title" class="form-control">')
                        .attr('id', titleId)
                        .attr('placeholder', placeholder)
                        .addClass(titleSize)
                        .attr('required', true)
                        .on('input', function(e) {
                            const re = /^\s*(\S.*?\S?)\s*$/;
                            const matched = $(this).val().match(re);
                            if (!matched) {
                                $(this).val('');
                            }
                        })
                    )
                    .append(
                        $('<label class="form-label">')
                        .attr('for', titleId)
                        .text(placeholder)
                    );

                $('#titleArea').append(titleTextArea);

                makePollCreationForm(duplicateCheckMethods, grades);


                // $('#choicesArea #choices div').append(`
                // <input type="number" id="addChoice" class="form-control" min="1" value="1" placeholder="Choices">
                // `);


                // // $('#choicesArea #choices div').append('<label for="addChoice" class="form-label">Choices</label>');
                // // $('#choicesArea #choices div').addClass('form-floating');

                // $('#choicesArea #choices').append(`
                // `);

                // makePollCreationForm(duplicateCheckMethods);

                break;

        }

    });
</script>

<!-- <style>
        #choices,
        #choicesForm .row {
            border: solid black 2px;
            margin-top: -2px;
            margin-bottom: -2px;
        }

        label {
            color: black;
        }
        </style> -->

</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include('partials/header.php') ?>

<div class="row">
    <div class="col">
        <main>

            <?php if (isset($poll)) { ?>

                <div class="row">
                    <div class="col">
                        <div id="toResultsButton"></div>
                    </div>
                </div>

            <?php } ?>

            <form id="choicesForm">

                <div class="row mb-3">
                    <div class="col">
                        <div id="titleArea">
                        </div>
                    </div>
                </div>

            </form>

        </main>
    </div>
</div>


<!-- Includes Body and container closing tags as well as <footer> -->
<?php include('partials/footer.php') ?>

</html>