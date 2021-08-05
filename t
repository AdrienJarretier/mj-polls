[1mdiff --git a/views/displayOrCreatePoll.ejs b/views/displayOrCreatePoll.ejs[m
[1mindex 3843d11..11092c1 100644[m
[1m--- a/views/displayOrCreatePoll.ejs[m
[1m+++ b/views/displayOrCreatePoll.ejs[m
[36m@@ -25,26 +25,27 @@[m
 [m
         $(function () {[m
 [m
[32m+[m[32m          $('#choicesArea').append(`[m
[32m+[m[32m          <div id="choices" class="row">[m
[32m+[m[32m            <div class="col"></div>[m
[32m+[m[32m          </div>[m
[32m+[m[32m          `);[m
[32m+[m
           switch (PAGE_TYPE) {[m
 [m
             case 'displayPoll':[m
 [m
               $('main').append(`[m
[31m-            <div class="alert alert-success" role="alert" id="hasVotedAlert">[m
[31m-              <h4 class="alert-heading">Has voted</h4>[m
[31m-              <p>You have voted on this poll.</p>[m
[31m-            </div>[m
[31m-            `);[m
[32m+[m[32m              <div class="alert alert-success" role="alert" id="hasVotedAlert">[m
[32m+[m[32m                <h2 class="alert-heading">Has voted</h2>[m
[32m+[m[32m                <p>You have voted on this poll.</p>[m
[32m+[m[32m              </div>[m
[32m+[m[32m              `);[m
 [m
               $('#titleArea').append(`[m
[31m-              <h2 id="title"></h2>[m
[32m+[m[32m              <h1 id="title"></h1>[m
               <br>`);[m
 [m
[31m-              $('#choicesArea').append(`[m
[31m-              <div id="choices">[m
[31m-              </div>[m
[31m-              `);[m
[31m-[m
               $('#gradesArea').append(`[m
               <form id="choicesForm">[m
               </form>[m
[36m@@ -64,6 +65,9 @@[m
                     choices correspond to.</label>[m
                 </div>`);[m
 [m
[32m+[m[32m              $('#choicesArea #choices div').append(`[m
[32m+[m[32m              `);[m
[32m+[m
               break;[m
 [m
           }[m
[36m@@ -75,7 +79,7 @@[m
 [m
     <% if (typeof poll !='undefined' ) { %>[m
 [m
[31m-      <script src="/javascripts/displayPoll.js"></script>[m
[32m+[m[32m      <script src="/javascripts/displayOrCreatePoll/displayPoll.js"></script>[m
 [m
       <% } else { %>[m
 [m
[36m@@ -85,7 +89,7 @@[m
         <% } %>[m
 [m
           <style>[m
[31m-            #choices .row,[m
[32m+[m[32m            #choices,[m
             #choicesForm .row {[m
               border: solid black 2px;[m
               margin-top: -2px;[m
