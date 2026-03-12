## ANALYSE APPLICATION FRONT END ##

  ### Architechture : ok
  Il y a une séparation des couches 

  * Configuration : 
  - le projet est en standalone components.
  - les fichiers de configuration sont correct.

  ### Correction du type any :

  - Observé dans : DetailComponent, UserService, SessionApiService et test-config.helper.
  - Modifications : remplacer par void pour UserService, et SessionApiService pour coller à ce que renvoie le back et pour DetailComponent  je remplace `.subscribe((_: any) => { ` par `.subscribe(() => {` car le paramètre `_` n’est pas utilisé et il n’a pas besoin de le typé en any.  Pour test-config.helper j'importe `import { Provider } from '@angular/core';` et je remplace le any par providers: `Provider[];`.

  ### Correction du désabonnement des observables :

  - Observé dans : FormComponent, DetailComponent, RegisterComponent, LoginComponent et MeComponent.
  - info recommandation Angular : (source https://angular.dev/guide/http/making-requests)
    * " Grâce à la complétion automatique, il n'y a généralement aucun risque de fuite de mémoire si les abonnements HttpClient ne sont pas supprimés.
    Cependant, comme pour toute opération asynchrone, nous vous recommandons vivement de supprimer les abonnements lorsque le composant qui les utilise est détruit, car la fonction de rappel de l'abonnement pourrait sinon s'exécuter et rencontrer des erreurs en tentant d'interagir avec le composant détruit. " 
  - Modifications : après avoir audité tous les subscribe() de l’application.
    - Ils concernent uniquement des Observables HttpClient, qui complètent automatiquement, ce qui supprime en général le risque de fuite mémoire.
    - La documentation Angular recommande une stratégie générale de nettoyage des abonnements, principalement pertinente pour les Observables long-lived (form valueChanges, router events, Subjects, etc.).
    - Dans cette application, il n’y a pas d’Observables de ce type, donc la gestion actuelle des abonnements respecte les bonnes pratiques.
  * S'il faut rester rigide et nettoyer tous les subscribes, la class `LoginComponent` a été modifiée (pour exemple).

  ### Correction de l'utilisation de ng* :

  - Observé dans : app.component,list.component, me.component, login.component, register.component, detail.component et form.component.