<body>

  <script type="module">
    import {
      LocaleMessages
    } from '/javascripts/LocaleMessages.js';

    const localeMsgs = await LocaleMessages.new(
      'client-header');

    // console.log(localeMsgs);

    $(function() {

      let nav = $('nav a button')
      const navMsgs = localeMsgs.get('nav');
      for (let i = 0; i < nav.length; ++i) {

        let navButton = nav.eq(i);
        const navButtonId = navButton.attr('id');
        navButton.text(navMsgs.get(navButtonId));
      }

    });
  </script>

  <div class="container-md">

    <!-- Body and container div will be closed in footer -->

    <div class="row mb-4">
      <div class="col">
        <header>

          <img src="/images/logo.png" class="img-fluid" alt="Majority judgement banner" />
          <!-- <p class="fs-4">A web application for creating, running and visualizing majority judgment polls.</p> -->

          <nav class="navbar bg-dark bg-gradient shadow-lg p-2 px-3 rounded">

            <!-- <a href="/"><button class="btn btn-md btn-secondary" type="button" id="Home">Home</button></a> -->

            <a href="/createPoll"><button class="btn btn-md btn-secondary" type="button" id="Create-Poll">Create a
                poll</button></a>

            <a href="/context"><button class="btn btn-md btn-secondary" type="button" id="Context">Context</button></a>

          </nav>

        </header>
      </div>
    </div>