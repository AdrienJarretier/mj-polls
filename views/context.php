<!DOCTYPE html>
<html lang="en">

<head>
  <?php include('partials/head.php') ?>

</head>

<!-- Includes Body and container div opening tags as well as <header> -->
<?php include('partials/header.php') ?>

  <div class="row">

    <div class="col">

      <h1>Principle of majority judgment</h1>

      <br>

      <h2>Procedure</h2>



      <p class="fs-4">Majority judgment is a voting system designed to elect a single winner, based on a highest
        median rule. It was introduced by two INRIA researcher in 2007, Michel Balinski and Rida Laraki.

        The voting process is as follows : </p>


      <ol class="list-group list-group-numbered fs-4">
        <li class="list-group-item list-group-item-dark  d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Grade attribution to the candidates</div>
            Voters give each candidate a cardinal value reflecting their opinion. Traditionnally, the voters
            appreciation can be expressed within a list of seven grades such as :
            Excellent, Very good, Good, Passable, Inadequate, Mediocre, Bad.
          </div>
        </li>
        <br>
        <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Majority grade computation</div>
            For each candidate, the majority grade is computed, and serves as a ranking metric among candidates.
            <strong>The majority grade is a median-like metric. It is built such as striclty more than half of the
              voters have given this majority grade or a higher grade to the candidate.</strong>
          </div>
        </li>
        <br>
        <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Winner detection </div>
            The winner is the candidate with the highest majority grade. If more than one candidate has the
            same
            highest majority grade, the winner is discovered by removing (one-by-one) any grades equal in value to
            the
            shared median grade from each tied candidate's total. This is repeated until only one of the previously
            tied candidates is currently found to have the highest majority grade.
          </div>
        </li>
      </ol>

      <br>

      <h2>Advantages</h2>

      <p class="fs-4">
        This procedure offers several advantages against existing alternatives. First, it allows voters to truly
        communicate how they feel about the candidates. For example, they are able to give bad grades to all of the
        candidates if no one
        suits them, or to give same grades to candidates they equally value.
        It was also shown to significantly reduce strategic and
        dishonest votes. Fianally, in contrast with more classical approches, it does not
        encounter paradoxes such as Condorcet's and Arrow's.</p>

      <br>

      <p class="fs-4" style="transform: rotate(0);">
        Read the original publication <a href="https://www.pnas.org/content/104/21/8720"
          class="stretched-link link-secondary">Balinski M.
          and R. Laraki (2007), A Theory of Measuring, Electing and Ranking, PNAS, 104(2), 8720-8725.</a> for more
        information.
      </p>


      <h1>Use the app</h1>


      <p class="fs-4">Download <a href="https://nodejs.org/en/download/" class="link-secondary">Node.js</a> (v14.17)
        <br>

        Download or clone and enter the project :
      </p>


      <pre class="bg-dark">
            <code class='fs-4'>
              git clone https://github.com/AdrienJarretier/mj-polls 
              cd mj-polls
            </code>
          </pre>
      <p class="fs-4">Install required dependencies:</p>

      <pre class="bg-dark">
            <code class='fs-4'>
              npm install
            </code>
          </pre>


      <p class="fs-4">Create poll database:</p>

      <pre class="bg-dark">
            <code class='fs-4'>
              node db/createDb.js
            </code>
          </pre>


      <p class="fs-4 ">Start the app:</p>
      <pre class="bg-dark">
            <code class='fs-4'>
              npm start
            </code>
          </pre>

      <p class="fs-4">You will be asked which adress and port should be used to run the app. (default is
        <code>127.0.0.1:3000</code>). <br>


        Now, go ahead and spread the world that majority judgment should replace current systems to allow more
        honest
        and mathematically sound votes!
      </p>


      <!-- <zero-md src="/context.md">
            <template>
              <link rel="stylesheet" href="/stylesheets/style.css">
            </template>
          </zero-md> -->

    </div>
  </div>

  <!-- Includes Body and container closing tags as well as <footer> -->
      <?php include('partials/footer.php') ?>

</html>