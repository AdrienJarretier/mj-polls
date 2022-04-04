<!DOCTYPE html>
<html lang="en">

<head>
  <?php include('partials/head.php') ?>

  <script src="/extLibs/marked-4.0.12/marked.min.js"></script>

  <script>
    $(function() {

      const readmeContent = <?= json_encode(file_get_contents(__DIR__ . '/../readme.md'), JSON_HEX_APOS); ?>;
      let readmeParts = readmeContent.split('---');

      readmeParts.push(readmeParts[1]);
      readmeParts.splice(1, 1);

      let reorderedReadme = readmeParts[0];

      for (let i = 1; i < readmeParts.length; ++i) {
        const part = readmeParts[i];
        reorderedReadme += '\n---\n' + part;
      }

      let htmledReadme = $(marked.parse(reorderedReadme));
      let divContent = $('#content');
      divContent.html(htmledReadme).find('h1').remove();

    });
  </script>

</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include('partials/header.php') ?>

<div class="row">
  <div id="content" class="col">

  </div>
</div>

<?php

// file_get_contents(__DIR__ . '/../readme.md');

?>


<!-- Includes Body and container closing tags as well as <footer> -->
<?php include('partials/footer.php') ?>

</html>