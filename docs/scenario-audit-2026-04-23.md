# Scenario Audit - 2026-04-23

## Scope

Gecontroleerd:

- `js/data-scenarios-stroom.js`
- `js/data-scenarios-bosbrand.js`
- `js/data-scenarios-overstroming.js`
- `js/data-scenarios-thuiskomen.js`
- `js/data-scenarios-drinkwater.js`
- `js/data-scenarios-nachtalarm.js`
- `js/prep.js`
- `js/data-state.js`
- `SCENARIO_SCHEMA.json`

Daarnaast zijn alle unieke externe bronlinks uit de scenariobestanden handmatig geverifieerd op 23 april 2026.

## Hoofdconclusie

De scenario-opbouw is in de basis sterk: de tijdlijnen zijn duidelijk, state-namen zijn consistent gekozen en ik vond geen onbekende `state.*` of `profile.*` verwijzingen in de scenariofiles. Er zitten wel een paar belangrijke logische fouten in de vertaling van prep-data naar scenario-keuzes, plus meerdere bronlinks die wel werken maar de exacte claim niet dragen.

## Kritieke bevindingen

### 1. `stroom`: radio-check gebruikt truthiness van `'ja'/'nee'` en toont daardoor radio-info aan spelers zonder radio

In `prep.js` worden toggle-antwoorden opgeslagen als strings zoals `'ja'` en `'nee'` via `toVal()` en de defaultinstelling in `renderPrep()` (`js/prep.js:166-187`). In `stroom` wordt later op meerdere plekken simpelweg `profile.hasRadio` gebruikt alsof het een boolean is:

- `js/data-scenarios-stroom.js:1240`
- `js/data-scenarios-stroom.js:1264`
- `js/data-scenarios-stroom.js:1269`

Omdat `'nee'` in JavaScript truthy is, krijgen spelers zonder radio hier alsnog:

- de radio-narrative op dag 3;
- de sociale keuzes die alleen logisch zijn als ze radio-info hebben.

Impact:

- inhoudelijke tegenspraak tussen prep-profiel en scenario-uitkomst;
- foutieve keuze-ontsluiting;
- foutieve broncontext voor spelers die nooit radio-info hebben gehad.

### 2. `overstroming`: gasstel-check gebruikt ook truthiness van `'ja'/'nee'`

Dezelfde string/boolean-fout zit in:

- `js/data-scenarios-overstroming.js:989`
- `js/data-scenarios-overstroming.js:1007`

`profile.hasGasStove` komt eveneens uit prep-toggles (`js/prep.js:119-125`, `js/prep.js:166-187`) en is dus `'ja'` of `'nee'`. Daardoor gaat deze logica mis:

- `!profile.hasGasStove` wordt voor `'nee'` onterecht `false`;
- `profile.hasGasStove` wordt voor `'nee'` onterecht `true`.

Effect:

- spelers zonder gasstel kunnen de warme-maaltijd-optie krijgen;
- de koude-maaltijd-optie wordt voor diezelfde spelers juist onderdrukt;
- de scène communiceert dus potentieel het omgekeerde van de intake.

### 3. `nachtalarm`: een "noodtas bij de deur" wordt ontsloten op basis van `hasDocuments`, niet op basis van een echte tasstatus

In `nachtalarm` wordt deze keuze getoond als:

- `js/data-scenarios-nachtalarm.js:257-261`

Voorwaarde:

- `profile.hasDocuments === 'ja' && profile.hasBOBBag !== 'ja'`

Maar `hasDocuments` is in prep alleen het sub-item "Kopieen van belangrijke documenten + telefoonnummers" (`js/prep.js:45-53`), niet een aparte indicator dat er een gepakte noodtas klaarstaat.

Gevolg:

- een speler kan alleen hebben aangegeven dat documentkopieen aanwezig zijn;
- het scenario doet daarna alsof er een complete noodtas klaarstaat bij de deur.

Dat is een logische sprong die niet door de intake wordt gedekt.

### 4. `bosbrand`: keuze zet `warnedKevin`, maar de consequence beschrijft een andere buur dan Kevin

In `bf_2b`:

- `js/data-scenarios-bosbrand.js:226-232`

Daar staat dat je "de bejaarde meneer naast je" waarschuwt, maar de state die gezet wordt is `warnedKevin: true`.

Later, in `bf_5c`:

- `js/data-scenarios-bosbrand.js:877-884`

wordt dat opgepakt alsof juist Kevin eerder gewaarschuwd is en je daarom bedankt.

Dat is een zichtbare continuiteitsfout in het verhaal.

## Scenario Per Scenario

### `stroom`

Sterk:

- duidelijke meerdaagse spanningsopbouw;
- state-namen zijn intern consistent;
- keuze- en kanaallogica sluiten meestal goed aan op de situatie.

Problemen:

- kritieke radio-bug door truthiness van `profile.hasRadio` (`js/data-scenarios-stroom.js:1240`, `:1264`, `:1269`);
- bronclaim bij wateropslag gebruikt een werkende Denk Vooruit-link, maar niet de juiste pagina voor de redenering over uitvallende waterdruk (`js/data-scenarios-stroom.js:291-293`);
- bronclaim over contant geld is deels logisch, maar de gekozen link noemt wel contant geld en niet expliciet pinautomaten/storingen (`js/data-scenarios-stroom.js:75-77`).

Beoordeling:

- scenarioflow inhoudelijk sterk;
- prep-integratie en bronmatching verdienen correctie.

### `natuurbrand`

Sterk:

- goede escalatie van rooklucht naar evacuatie naar opvang;
- kind- en mobiliteitsvertakkingen zijn logisch ontworpen;
- de link naar de Brandweer-pagina over natuurbrand ondersteunt de vluchtinstructie goed.

Problemen:

- continuiteitsfout rond `warnedKevin` versus "bejaarde meneer" (`js/data-scenarios-bosbrand.js:226-232` en `:877-884`);
- de bronverwijzing "Brandweer: waarschuw buren" wijst in werkelijkheid naar Denk Vooruit en gaat meer over voorbereidende gesprekken dan over direct evacueren (`js/data-scenarios-bosbrand.js:226-228`);
- meerdere claims over "noodtas klaarzetten" gebruiken de vluchtplan-pagina, terwijl die pagina vooral over vluchtgedrag en 112 gaat, niet over een klaarstaande tas (`js/data-scenarios-bosbrand.js:61`, `:345`, `:366`).

Beoordeling:

- verhaallijn grotendeels logisch;
- een paar details ondermijnen de geloofwaardigheid van de sociale tak en bronverwijzing.

### `overstroming`

Sterk:

- goed onderscheid tussen vroeg evacueren en thuis hoger schuilen;
- kindscenes en nazorgscenes passen logisch in de opbouw;
- VNOG- en VDE-bronnen sluiten inhoudelijk goed aan op elektra- en overstromingsgevaar.

Problemen:

- kritieke `hasGasStove` bug (`js/data-scenarios-overstroming.js:989-1007`);
- keuze "ramen dichten, deuren afdichten en zandzakken neerleggen" verwijst naar een Denk Vooruit-pagina die die instructie niet daadwerkelijk noemt (`js/data-scenarios-overstroming.js:223-225`);
- de Rijksoverheid-bron voor "documenten, medicijnen en essentiele spullen" ondersteunt medicijnen en essentiele spullen duidelijk, maar documenten vooral indirect via een noodpakket-verwijzing (`js/data-scenarios-overstroming.js:92`).

Beoordeling:

- structuur sterk;
- de kookscène bevat een echte logische fout;
- een deel van de bronclaims is te stellig geformuleerd voor wat de gelinkte pagina zegt.

### `thuiskomen`

Sterk:

- de routevertakkingen per vervoermiddel zijn conceptueel helder;
- het scenario houdt rekening met partner/kinderen en afstand;
- de thuiskomstscenes sluiten logisch aan op de dagopbouw.

Problemen:

- de bronclaim "loop bij thuiskomst altijd gas, kaarsen en ramen na" is specifieker dan de Brandweer-pagina waarop wordt gelinkt; die pagina geeft wel winter-/verwarmingsveiligheid en kaarsentips, maar geen expliciete thuiskomst-checklist (`js/data-scenarios-thuiskomen.js:719-721`, `:837-839`).

Beoordeling:

- inhoudelijk coherent;
- bronmatching te ambitieus geformuleerd.

### `drinkwater`

Sterk:

- compact en lineair;
- goed te volgen escalatie;
- geen opvallende state- of profielnaamconflicten gevonden.

Problemen:

- in dit scenario zitten geen inline `source`-links, waardoor de inhoud vanuit de scenario-data zelf niet extern verifieerbaar is.

Beoordeling:

- logisch stabiel;
- onderbouwing mist in vergelijking met de andere scenario's.

### `nachtalarm`

Sterk:

- beste structurele consistentie van de set;
- tijdlijn van alarm, rook, vlucht en buitenfase klopt goed;
- meerdere Brandweer-bronnen passen inhoudelijk sterk, zoals rookmelders, 112 buiten bellen en deur dicht doen.

Problemen:

- "noodtas bij de deur" ontsloten via `hasDocuments` in plaats van een echte tasstatus (`js/data-scenarios-nachtalarm.js:257-261`, `js/prep.js:45-53`);
- de vluchtplan-bron ondersteunt niet expliciet de claim dat er al een noodtas/vluchttas klaarstaat (`js/data-scenarios-nachtalarm.js:257-267`);
- de bron bij "stroom uitschakelen bij de meterkast" verwijst naar een algemene Brandweer-pagina over elektrische apparaten, niet naar een pagina die die specifieke noodhandeling onderbouwt (`js/data-scenarios-nachtalarm.js:271-275`).

Beoordeling:

- sterkste scenario qua flow;
- zwakker in hoe prep-data naar concreet gedrag wordt vertaald.

## Linkverificatie

### Samenvatting

- Aantal unieke scenario-URLs gecontroleerd: 17
- Aantal echt dode links gevonden: 0
- Aantal links die werken maar de claim slechts gedeeltelijk of niet ondersteunen: meerdere

### Matrix

| URL | Status | Ondersteuning van claim |
| --- | --- | --- |
| `https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen` | Werkt | Ondersteunt zaklamp, water, contant geld als noodpakketitems; ondersteunt niet expliciet de claims over pinautomaten of uitvallende waterdruk |
| `https://www.denkvooruit.nl/risicos/risicos-in-nederland/geen-stroom` | Werkt | Ondersteunt stekkers eruit trekken en een kleine ruimte warm houden |
| `https://www.brandweer.nl/onderwerpen/veilig-en-warm-de-winter-door/` | Werkt | Ondersteunt veilige kaarsen / winterveiligheid; ondersteunt geen expliciete "thuiskomst-check gas, kaarsen en ramen" |
| `https://www.brandweer.nl/onderwerpen/vlucht-met-je-vluchtplan/` | Werkt | Ondersteunt vluchten, huisgenoten waarschuwen, 112 bellen als je veilig bent, buren waarschuwen; ondersteunt geen expliciete klaarstaande noodtas/vluchttas |
| `https://www.brandweer.nl/onderwerpen/natuurbrand-voorkomen-tips-vakantieverblijf/` | Werkt | Ondersteunt het weghalen van brandbare materialen rond de woning |
| `https://www.unodc.org/res/drug-prevention-and-treatment/publications/data/drug-abuse-treatment-and-rehabilitation_caring-for-your-child-in-crisis-situations_html/UN-Caring-for-child-in-Crisis-Situations-booklet-200929-DIGITAL.pdf` | Werkt | Ondersteunt rust, nabijheid en uitleg op kindniveau in crisissituaties |
| `https://www.denkvooruit.nl/bereid-je-voor/praat-erover` | Werkt | Ondersteunt praten met buren en nadenken over kwetsbare mensen; ondersteunt direct evacuatie-waarschuwen slechts indirect |
| `https://www.brandweer.nl/onderwerpen/natuurbrand/` | Werkt | Ondersteunt vluchten naar openbare weg en dwars op de brand lopen |
| `https://www.brandweer.nl/onderwerpen/blijf-uit-de-rook/` | Werkt | Ondersteunt dat rook altijd schadelijk/giftig is en dat je eruit moet blijven |
| `https://www.rijksoverheid.nl/onderwerpen/water/vraag-en-antwoord/wat-moet-ik-doen-bij-een-dreigende-overstroming` | Werkt | Ondersteunt medicatie, essentiele spullen, familie informeren, woning afsluiten; documenten worden niet expliciet genoemd |
| `https://www.denkvooruit.nl/risicos/risicos-in-nederland/overstroming` | Werkt | Ondersteunt voorbereiding en updates volgen; ondersteunt niet expliciet "deuren, ramen en kieren afdichten om water buiten te houden" |
| `https://www.vnog.nl/risicos/overstroming/woning?tab_1=2` | Werkt | Ondersteunt gas/water/elektra afsluiten en stekkers uit stopcontact halen |
| `https://www.vde.com/topics-en/consumer-protection/electronics-flooding` | Werkt | Ondersteunt dat je nooit een ondergelopen ruimte met elektra mag betreden |
| `https://www.brandweer.nl/onderwerpen/het-juiste-blusmiddel/` | Werkt | Ondersteunt dat water ongeschikt is bij een elektrische brand en dat het juiste blusmiddel belangrijk is |
| `https://www.brandweer.nl/onderwerpen/rookmelders/` | Werkt | Ondersteunt de claim dat je na een rookmelder-alarm ongeveer drie minuten hebt om te vluchten |
| `https://www.brandweer.nl/onderwerpen/doe-de-deur-dicht/` | Werkt | Ondersteunt dat een gesloten deur rook en vuur afremt |
| `https://www.brandweer.nl/onderwerpen/elektrische-apparaten/` | Werkt | Ondersteunt brandpreventie en stekkers eruit na stroomuitval; ondersteunt niet expliciet "schakel bij elektrische brand de stroom uit bij de meterkast" |

## Cross-file consistentie

### Schema versus data

`SCENARIO_SCHEMA.json:53-56` laat alleen `blue`, `orange` en `red` toe voor `dayBadgeClass`. In de scenario-data komen ook `''` en `green` voor, bijvoorbeeld:

- `js/data-scenarios-stroom.js:1228`
- `js/data-scenarios-thuiskomen.js:798`

Als de scenario's ooit strikt tegen deze JSON-schema gevalideerd worden, gaan ze daarop stuk.

## Eindoordeel

Als inhoudelijk scenario-ontwerp staat dit project behoorlijk stevig. De grootste risico's zitten niet in het algemene verhaalritme, maar in:

1. prep-velden die als boolean behandeld worden terwijl ze strings zijn;
2. state-overgangen die een andere persoon impliceren dan de narrative zegt;
3. bronlinks die wel live zijn, maar net niet de claim dragen die in de UI wordt getoond.

Als je dit wilt omzetten naar een gerichte fixronde, zou ik beginnen met:

1. alle prep-afhankelijke checks standaardiseren op `=== 'ja'`;
2. `warnedKevin` en de bijbehorende consequence/narrative recht trekken;
3. `source.text` en `source.url` per keuze opnieuw op elkaar afstemmen.
