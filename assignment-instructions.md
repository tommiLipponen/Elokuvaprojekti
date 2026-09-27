# Työohje: Elokuvasovellus

Projektin toimeksiantona on toteuttaa leffaharrastajille web-sivusto.
Sovellus hyödyntää myöhemmin mainittuja avoimen datan lähteitä. Sovelluksen selaimessa toimiva osuus toteutetaan React- ja palvelin Node-tekniikalla. Tietokantana käytetään PostgreSQL-tietokantaa.

Käytettävä avoimen datan rajapinta on The movie database, joka sisältää suuren määrän elokuviin liittyvää avointa dataa. API:n käyttö vaatii rekisteröitymisen, jonka jälkeen saa tarvittavan API-avaimen/tokenin.

Sovelluksen toteutus koostuu seuraavista ominaisuuksista:

ID | Ominaisuus | Kuvaus
--- | --- | ---
1 | Responsiivisuus | Käyttöliittymä skaalautuu järkevästi ikkunan kokoa muutettaessa ei kokoisille näytöille.
2 | Rekisteröityminen | Käyttäjä voi rekisteröityä sivustolle. Käyttäjätili sisältää tunnuksen (sähköposti) ja salasanan, jonka minimipituus on 8 merkkiä sisältäen vähintään yhden ison kirjaimen ja numeron.
3 | Kirjautuminen | Käyttäjä voi kirjautua sivustolle luomallaan tunnuksella. Käyttäjä voi kirjautua ulos sivustolta.
4 | Rekisteröitymisen poistaminen | Käyttäjä voi poistaa luomansa käyttäjätilin. Samalla poistetaan käyttäjän luoma data (11, 13 ja 14).
5 | Haku | Sivustolla voi hakea elokuvia ja sarjoja eri hakukriteereillä (vähintään 3 erilaista hakua/kriteeriä). Toiminto ei vaadi kirjautumista.
6 | Nyt elokuvateattereissa | Sivustolta näkee elokuvat, jotka pyörivät parhaillaan elokuvateattereissa Suomessa. Toiminto ei vaadi kirjautumista.
7 | Ryhmäsivu | Käyttäjä voi luoda uuden ryhmän sivustolle haluamallaan nimellä. Luodut ryhmät näytetään listassa, josta voi siirtyä myös yksittäisen ryhmän sivulle. Ryhmien listaus on näkyvissä kaikille käyttäjille, mutta vain ryhmän jäsenet pääsevät katselemaan ryhmäsivun tarkempaa sisältöä. Ryhmän voi poistaa sen luonut käyttäjä (omistaja).
8 | Jäsenen lisääminen | Käyttäjä voi lähettää liittymispyynnön ryhmään. Omistaja voi hyväksyä tai hylätä pyynnön.
9 | Jäsenen poistaminen | Ryhmän omistaja voi poistaa jäsenen tai jäsen voi itse poistua ryhmästä.
10 | Ryhmäsivun kustomointi | Ryhmän jäsen voi lisätä ryhmäsivulle haetun elokuvan (5).
11 | Elokuvan arvostelu | Kirjautunut käyttäjä voi lisätä sivustolle leffaarvostelun. Arvostelu sisältää tekstin ja tähdet (1-5). Arvostelussa näkyy myös käyttäjän käyttäjänimi sekä ajankohta, jolloin arvostelu on annettu. Arvostelu näytetään sivustolla elokuvan muiden tietojen yhteydessä.
12 | Arvostelujen selaaminen | Sivustolla näytetään leffa-arvostelut kaikille käyttäjille.
13 | Suosikkilista | Kirjautunut käyttäjä voi luoda oman suosikkilistan, joka näytetään muille käyttäjille omana sivunaan.
14 | Suosikkilistan jakaminen | Kirjautunut käyttäjä voi jakaa suosikkilistan URL-osoitteena, joka näytetään kaikille käyttäjille. Jakamisen voi toteuttaa esimerkiksi ”share”-painikkeena.
15 | Vapaavalintainen ominaisuus | Lisää joku itse keksimäsi ominaisuus sivustolle.

Pisteytys:

Ominaisuus | Pisteet
--- | ---
1 Responsiivisuus | 2 p.
2 Rekisteröityminen | 1 p.
3 Kirjautuminen | 1 p.
4 Rekisteröitymisen poistaminen | 1 p.
5 Haku | 2 p.
6 Nyt elokuvateattereissa | 1 p.
7 Ryhmäsivu | 2 p.
8 Jäsenen lisääminen | 1 p.
9 Jäsenen poistaminen | 1 p.
10 Ryhmäsivun kustomointi | 2 p.
11 Elokuvan arvostelu | 2 p.
12 Arvostelujen selaaminen | 1 p.
13 Suosikkilista | 1 p.
14 Suosikkilistan jakaminen | 1 p.
15 Vapaavalintainen ominaisuus | 1 p.

Yhteensä: 20 p.

Projektin dokumentointi ja hallinta koostuu seuraavista osa-alueista:

ID | Kuvaus | Pisteet
--- | --- | ---
1 | Luokkakaavio tietokannasta | 2 p.
2 | Käyttöliittymäsuunnitelma | 2 p.
3 | REST-dokumentaatio | 2 p.
4 | Kehitysjonon hallinta | 2 p.
5 | Versionhallinta | 2 p.
6 | Projektin hallinta (yhteistyö, aikataulujen noudattaminen, omien tehtävien hoitaminen projektin jäsenenä) | 10 p.

Yhteensä: 20 p.

Sovelluksen REST-rajapintaa testataan toteuttamalla automaattisia yksikkötestejä. Huomaa, että testien tulee sisältää tarpeen mukaan sekä positiivisia että negatiivisia testejä. Kaikkia toteutettavia rajapintoja ei testata (oikeasti ehkä testattaisiin, nyt on tarkoitus harjoitella testien tekemistä). Seuraavat toiminnallisuudet testataan:

Ominaisuus | Pisteet
--- | ---
1 Kirjautuminen | 1 p.
2 Uloskirjautuminen | 1 p.
3 Rekisteröityminen | 1 p.
4 Rekisteröitymisen poistaminen | 1 p.
5 Arvostelujen selaaminen | 1 p.

Yhteensä: 5 p.
