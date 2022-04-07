<script type="module">
    import {
        LocaleMessages
    } from '/javascripts/LocaleMessages.js';

    import {
        get
    } from '/javascripts/utils.js';

    $(async function() {

        const localeMsgs = await LocaleMessages.new(
            'client-footer');

        $('#footerContactUsText').text(localeMsgs.get('contactUs'));
        $('#footerPollsCounter').text(localeMsgs.get('pollsCounter', {
            'count': await get('/polls/count')
        }));

    });
</script>

<div class="row">

    <div class="col" style="text-align:center;">

        <footer>

            <hr class="my-2">

            <div class="row">
                <div class="col">

                    <a href="https://github.com/AdrienJarretier/mj-polls/issues" class="link-secondary">
                        <span id="footerContactUsText"></span>
                        <br>
                        <i class="bi-github" role="img" aria-label="GitHub" style="font-size:32px;">
                        </i>
                    </a>
                </div>

                <div class="col">
                    <span id="footerPollsCounter"></span>
                </div>
            </div>

        </footer>

    </div>

</div>

<!-- Body and container div closing tags -->

</div>

</body>