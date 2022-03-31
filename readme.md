# ![Majority Judgment](/static/public/images/logo.png "Majority Judgement")


## This project is a web application for creating, running and visualizing **majority judgment** polls.
---

You can use the app by visiting <https://vote.sirtak.fr>


Or if you want to host it yourself you can start with theses instructions : [Hosting instructions](./readme_hosting.md)

To contact us for anything, you can open an issue at <https://github.com/AdrienJarretier/mj-polls/issues>

---
### Principle of majority judgment

<br>

Majority judgment is a voting system designed to elect a single winner, based on a highest median rule. It was introduced by two INRIA researcher in 2007, Michel Balinski and Rida Laraki.

The voting process is as follows : 

+ Voters give each candidate a cardinal value reflecting their opinion. Traditionnally, the voters appreciation can be expressed within a list of seven grades, for example :
*Excellent, Very good, Good, Passable, Inadequate, Mediocre, Bad.*

+ For each candidate, the median grade is computed, and serves as a ranking metric among candidates.

+ The winner is **the candidate with the greatest median grade**. If more than one candidate has the same highest median-grade, the winner is discovered by removing (one-by-one) any grades equal in value to the shared median grade from each tied candidate's total. This is repeated until only one of the previously tied candidates is currently found to have the highest median-grade.


This procedure offers several advantages against existing alternatives :

+ It allows voters to truly communicate how they feel about the candidates. For example, they are able to give bad grades to all of the candidates if no one suits them, or to give same grades to candidates they equally value.

+ It was shown to significantly reduce strategic and dishonest votes

+ In contrast with more classical approches, it does not encounter paradoxes such as Condorcet's and Arrow's, .

[Balinski M. and R. Laraki (2007), A Theory of Measuring, Electing and Ranking, PNAS, 104(2), 8720-8725.](https://www.pnas.org/content/104/21/8720)
