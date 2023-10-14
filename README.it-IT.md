** DISCLAIMER: Questo progetto è stato creato nell'ambito dell'hackathon "Hack to Innovate (https://events.codemotion.com/hackathons/hack-to-innovate/home)".
Non descrive un prodotto realmente esistente e non è stato avallato da Intesa Sanpaolo o IBM
**

# Dot
Questa repository contiene la demo web di Dot, la nuova interfaccia con cui Intesa Sanpaolo ridisegna il modo di fare banca.


## Pre-requisiti: 
* Un account [IBM Cloud](https://cloud.ibm.com)
* [Netlify CLI](https://docs.netlify.com/cli/get-started)

## Passi per eseguire questo progetto in locale

* Crea un'istanza [IBM Watson](https://www.ibm.com/it-it/watson). È necessario selezionare almeno il piano Plus per poter interagire con l'assistente tramite API.
* Crea la tua skill o carica il file `action-skill.json` di questo progetto nella tua istanza Watson 
* Clona questa repository e aggiungi un file `.env` con queste variabili:
  * WATSON_API_KEY
  * WATSON_SERVICE_URL
  * WATSON_ASSISTANT_ID
  
  Se stai utilizzando Netlify, puoi aggiungere queste variabili nel tuo account Netlify
* Esegui `npm i`
* Esegui `netlify dev`

