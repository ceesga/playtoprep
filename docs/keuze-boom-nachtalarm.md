# Keuze-boom — Nachtalarm scenario

**Scenario:** "De rookmelder gaat af in de nacht"
**Tijdspanne:** 22:30 (maandag) → 02:45 (dinsdag)
**Scenes:** na_intro → na_alarm → na_0 → na_1 → na_2 → na_2b → na_3 → na_4 → na_5 → rapport

## Legenda

| Stijl | Betekenis |
|---|---|
| Blauw rechthoek | Scene |
| Groen afgerond | Gewone keuze — altijd zichtbaar |
| Oranje afgerond | Conditionele keuze — ⚠️ alleen voor bepaald profiel |
| Rood/oranje scene | Conditionele scène — ⚠️ kan volledig worden overgeslagen |
| Paars | Rapport (eindpunt) |

> Alle keuzes in een scene leiden altijd naar dezelfde volgende scene.
> De keuze bepaalt het verhaal, niet de route.

```mermaid
flowchart TD
    classDef scene      fill:#1a3a5c,stroke:#5b9bd5,color:#fff,font-weight:bold
    classDef keuze      fill:#1e4620,stroke:#70b570,color:#fff
    classDef keuzeC     fill:#4a2c00,stroke:#e8a020,color:#fff
    classDef sceneCond  fill:#3d1a00,stroke:#e05010,color:#fff,font-style:italic
    classDef rapport    fill:#3a1a5a,stroke:#9060d0,color:#fff,font-weight:bold

    NA_INTRO["na_intro · 22:30\nNaar bed gaan"]:::scene
    CI1(["😴 Ga slapen"]):::keuze

    NA_ALARM["na_alarm · 02:17\nAlarm in het donker\n— auto-doorgaan, geen keuze —"]:::scene

    S0["na_0 · 02:17\nWakker schrikken"]:::scene
    C0A(["⚡ Opstaan en luisteren\nwaar het geluid vandaan komt"]):::keuze
    C0B(["🗣️ Huisgenoten direct wakker maken\n⚠️ als: huisgenoten aanwezig + nog niet gewaarschuwd"]):::keuzeC
    C0C(["🛌 Blijven liggen,\nvast loos alarm"]):::keuze

    S1["na_1 · 02:18\nDeur open — rook in de hal"]:::scene
    C1A(["🗣️ Direct iedereen wakker maken\n⚠️ als: huisgenoten aanwezig + nog niet gewaarschuwd"]):::keuzeC
    C1B(["📱 Meteen 112 bellen"]):::keuze
    C1C(["🔍 Zelf gaan kijken\nwat er aan de hand is"]):::keuze

    S2["na_2 · 02:19\nRook in de woonkamer"]:::scene
    C2A(["💧 Pan water over\nhet stopcontact gooien"]):::keuze
    C2B(["🔍 Dichterbij gaan kijken"]):::keuze
    C2C(["🚪 Teruglopen, iedereen naar buiten sturen\n⚠️ als: huisgenoten aanwezig + nog niet gewaarschuwd"]):::keuzeC
    C2D(["🚪 Woonkamerdeur dichtdoen\nen naar buiten gaan"]):::keuze

    S2B["na_2b · 02:20\nHuisgenoten komen de gang op\n⚠️ SCÈNE CONDITIONEEL:\nwordt overgeslagen als geen huisgenoten\nof als huisgenoten al gewaarschuwd zijn"]:::sceneCond
    C2BA(["🚪 Iedereen direct naar buiten sturen"]):::keuze
    C2BB(["🐾 Huisdier roepen en meenemen\n⚠️ als: heeft huisdier"]):::keuzeC

    S3["na_3 · 02:20\nRook wordt dikker — op de drempel"]:::scene
    C3A(["📁 Documenten / medicijnen\ngrijpen bij de deur\n⚠️ als: heeft documenten of medicijnen\nen geen vluchttas"]):::keuzeC
    C3B(["🎒 Vluchttas pakken en rennen\n⚠️ als: heeft vluchttas"]):::keuzeC
    C3C(["⚡ Stroom uitschakelen\nbij de meterkast"]):::keuze
    C3D(["🚪 Meteen naar buiten gaan"]):::keuze
    C3E(["🔑 Sleutels en telefoon zoeken"]):::keuze
    C3F(["🧒 / 🦽 Huisgenoten of kwetsbare personen helpen\n⚠️ als: huisgenoten / kinderen / bewegingsbeperking"]):::keuzeC

    S4["na_4 · 02:22\nBuiten — wachten op brandweer"]:::scene
    C4A(["📱 112 bellen\n⚠️ als: 112 nog niet gebeld"]):::keuzeC
    C4B(["👥 Controleren of iedereen buiten is\n⚠️ als: huisgenoten aanwezig"]):::keuzeC
    C4C(["🏘️ Buren waarschuwen\ndat er brand is in jouw woning"]):::keuze
    C4D(["⏳ Buiten wachten op de brandweer"]):::keuze

    S5["na_5 · 02:45\nBrandweer heeft controle"]:::scene
    C5A(["✅ Alles bij je —\nslaapplek regelen"]):::keuze
    C5B(["🏠 Vragen of je nog kort\nnaar binnen mag voor papieren"]):::keuze

    RAPPORT(["📋 RAPPORT"]):::rapport

    NA_INTRO --> CI1 --> NA_ALARM --> S0
    S0 --> C0A & C0B & C0C
    C0A & C0B & C0C --> S1
    S1 --> C1A & C1B & C1C
    C1A & C1B & C1C --> S2
    S2 --> C2A & C2B & C2C & C2D
    C2A & C2B & C2C & C2D --> S2B
    S2B --> C2BA & C2BB
    C2BA & C2BB --> S3
    S3 --> C3A & C3B & C3C & C3D & C3E & C3F
    C3A & C3B & C3C & C3D & C3E & C3F --> S4
    S4 --> C4A & C4B & C4C & C4D
    C4A & C4B & C4C & C4D --> S5
    S5 --> C5A & C5B
    C5A & C5B --> RAPPORT
```
