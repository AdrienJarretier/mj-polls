<body>

  <script type="module">
    import {
      LocaleMessages
    } from '/javascripts/LocaleMessages.js';

    const localeMsgs = await LocaleMessages.new(
      'client-header');

    // console.log(localeMsgs);

    $(function() {

      // ---------------------------------------------
      // --------- Localize nav buttons text ---------

      const navMsgs = localeMsgs.get('nav');

      let navButtons = $('nav a button');
      for (let i = 0; i < navButtons.length; ++i) {

        let navButton = navButtons.eq(i);
        const navButtonId = navButton.attr('id');
        navButton.text(navMsgs.get(navButtonId));
      }

      // ----------------------------------------------
      // -------------- Add lang to href --------------

      let navLinks = $('nav a');
      for (let i = 0; i < navLinks.length; ++i) {

        let navLink = navLinks.eq(i);

        navLink.attr('href', '/' + LocaleMessages.currentLocale + navLink.attr('href'));
      }

      // ----------------------------------------------

      // ---------------------------------------------
      // ---------- Fill languages dropdown ----------

      let langList = $('#navLangDropdownList');
      let reUrlLangPattern = new RegExp(
        LocaleMessages.urlLangPattern
      );

      console.log(reUrlLangPattern);

      for (const lang of LocaleMessages.availableLanguages) {

        if (LocaleMessages.currentLocale == lang[0]) {
          $('#navLangDropdownLabel').text(lang[1]);
        }

        console.log();
        console.log(location.pathname);
        let localizedHref = location.pathname.replace(
          reUrlLangPattern,
          '/' + lang[0]
        );

        console.log(localizedHref);

        const listLink = $('<a class="dropdown-item">')
          .attr('href', localizedHref)
          .text(lang[1]);

        console.log(listLink);

        let listItem =
          $('<li>')
          .append(
            listLink
          );


        langList.append(listItem);
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

            <span>

              <a href="/context"><button class="btn btn-md btn-secondary me-3" type="button" id="Context">Context</button></a>

              <div class="dropdown d-inline">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="navLangDropdownLabel" data-bs-toggle="dropdown" aria-expanded="false">
                </button>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navLangDropdownLabel" id="navLangDropdownList">
                </ul>
              </div>

            </span>

          </nav>

        </header>
      </div>
    </div>