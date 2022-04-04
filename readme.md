# ![Majority Judgment](/static/public/images/logo.png "Majority Judgement")


## This project is a web application for creating, running and visualizing **majority judgment** polls.
---

You can use the app by visiting <https://vote.sirtak.fr>


Or if you want to host it yourself you can start with these instructions : [Hosting instructions](./readme_hosting.md)

To contact us for anything, you can open an issue at <https://github.com/AdrienJarretier/mj-polls/issues>

---
### Principle of majority judgment

<br>

The **Majority judgment** is a voting system designed to elect a winner based on the evaluation of all candidates by the voters. This system was shown to significantly reduce strategic and dishonest votes.

Indeed, this procedure offers several advantages over existing alternatives :

+ It allows voters to truly say how they feel about all candidates. This is a strong improvement over the widespread **first-past-the-post** electoral systems (AKA single-member plurality voting), where only one candidate must be chosen, and the voter can not express any opinion about the others. 

+ By allowing voters to grade each candidate there is no **Vote splitting** anymore.

+ A voter can express strong judgment differences by exploiting the entire range of grades, or even give the same grade to candidates they equally value. None of these are possible in **ranked voting** systems, in which candidates are simply ordered by preference. 

+ The need for **Tactical voting** is nullified

+ It does not suffer from **Condorcet's paradox**

+ By using common language to grade the candidates instead of a ranking them and assuming the question of the poll is precise, it avoids **Arrow's impossibility theorem**.

<br>

The voting process is as follows : 

+ Voters give each candidate a cardinal value reflecting their opinion. Traditionnally, the voters appreciation can be expressed within a list of grades, such as :
*Excellent, Very good, Good, Acceptabl, Poor, To Reject.*

 ![Majority Judgment](/static/public/images/context/en/pollExample.png "Majority Judgement")

+ For each candidate, the median grade is computed, and serves as a ranking metric among candidates.

+ The winner is **the candidate with the greatest median grade, also called majority grade**. If more than one candidate has the same highest median grade, the winner is discovered by removing (one-by-one) any grades equal in value to the shared median grade from each tied candidate's total. This is repeated until only one of the previously tied candidates is currently found to have the highest median-grade.


It was introduced by two INRIA researcher in 2007, Michel Balinski and Rida Laraki.


[Balinski M. and R. Laraki (2007), A Theory of Measuring, Electing and Ranking, PNAS, 104(2), 8720-8725.](https://www.pnas.org/content/104/21/8720)

----
More ressources on voting systems :

+ [Majority Judgement: Measuring Ranking and Electing](https://mitpress.mit.edu/books/majority-judgment), book by Balinski M. and R. Laraki (2011)

+ [To build a better ballot, an interactive guide to alternative voting systems](https://ncase.me/ballot/) by Nicky Case, 2016.
