# ![Jugement majoritaire](/static/public/images/logo.png "Jugement majoritaire")

## Ce projet est une application web pour la création, la publication et la visualisation de sondages avec le **jugement majoritaire**.
---

Vous pouvez utiliser l'application en visitant <https://vote.sirtak.fr/fr>


Ou si vous souhaitez l'héberger vous-même, vous pouvez commencer par ces instructions : [Instructions d'hébergement](./readme_hosting.md)

Pour nous contacter, vous pouvez ouvrir un ticket sur <https://github.com/AdrienJarretier/mj-polls/issues>

---
### Principe du jugement majoritaire

<br>

Le **jugement majoritaire** est un système de vote conçu pour élire un gagnant sur la base de l'évaluation de tous les candidats par les électeurs. Il a été démontré que ce système réduisait considérablement les votes stratégiques et malhonnêtes.

En effet, cette procédure offre plusieurs avantages par rapport aux alternatives existantes :

+ Il permet aux électeurs de vraiment dire ce qu'ils pensent de tous les candidats. Il s'agit d'une nette amélioration par rapport aux systèmes électoraux largement répandus **uninominaux majoritaires à un tour**, où un seul candidat doit être choisi et l'électeur ne peut exprimer aucune opinion sur les autres.

+ En permettant aux électeurs de noter chaque candidat, il n'y a plus de **division des votes**.

+ Un électeur peut exprimer de fortes différences de jugement en exploitant toute la gamme de notes, ou même donner la même note à des candidats qu'il apprécie également. Rien de tout cela n'est possible dans les systèmes de **vote par classement**, dans lesquels les candidats sont simplement classés par préférence.

+ Le besoin de **vote utile** disparait

+ Il ne souffre pas du **paradoxe de Condorcet**

+ En utilisant un langage commun pour noter les candidats au lieu de les classer et en supposant que la question du sondage est précise, il évite le **théorème d'impossibilité d'Arrow**.

<br>

Le processus de vote est le suivant :

+ Les électeurs attribuent à chaque candidat une valeur qualitative ordonnée reflétant leur opinion. Traditionnellement, l'appréciation des électeurs peut être exprimée au sein d'une liste de notes, telles que :
*Excellent, Très bien, Bien, Passable, Insuffisant, A rejeter.*

![Exemple de sondage](/static/public/images/context/fr/pollExample.png "Exemple de sondage")

+ Pour chaque candidat, la mention majoritaire est calculée et sert de mesure de classement parmi les candidats.

+ Le gagnant est **le candidat avec la meilleure mention majoritaire**. Si plus d'un candidat a la même mention majoritaire, le gagnant est découvert en supprimant un vote de cette mention dans chacun des candidats à égalité, ceci est répété jusqu'à ce qu'un seul des candidats précédemment ex aequo ait actuellement la note médiane la plus élevée.

![Exemple de résultats](/static/public/images/context/fr/resultsExample.png "Exemple de résultats")


Il a été introduit par deux chercheurs INRIA en 2007, Michel Balinski et Rida Laraki.


[Balinski M. et R. Laraki (2007), Une théorie de la mesure, de l'élection et du classement, PNAS, 104(2), 8720-8725.](https://www.pnas.org/content/104/21/ 8720)

----
Plus de ressources sur les systèmes de vote :

+ [Réformons l’élection présidentielle ! ](https://scienceetonnante.com/2016/10/21/reformons-lelection-presidentielle/), Science étonnante

+ [Majority Judgement: Measuring Ranking and Electing](https://mitpress.mit.edu/books/majority-judgment), livre de Balinski M. et R. Laraki (2011)

+ [Pour construire un meilleur bulletin de vote, un guide interactif des systèmes de vote alternatifs](https://ncase.me/ballot/) par Nicky Case, 2016.