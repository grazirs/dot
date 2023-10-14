Versione in italiano: [![en](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/grazirs/dot/blob/main/README.it-IT.md)\
** DISCLAIMER: This project was created as part of the hackathon "[Hack to Innovate](https://events.codemotion.com/hackathons/hack-to-innovate/home)". It does not describe a truly existing product and has not been endorsed by Intesa Sanpaolo or IBM **

# Dot
This repository contains the web demo of Dot, the new interface with which Intesa Sanpaolo redesigns the way of banking.


## Pre-requirements: 
* An [IBM Cloud](https://cloud.ibm.com) Account
* [Netlify CLI](https://docs.netlify.com/cli/get-started)

## Steps to run this project locally

* Create an [IBM Watson](https://www.ibm.com/it-it/watson) instance. You will need to choose at least the Plus plan in order to interact with the assistant via API.
* Create your own skill or upload the action-skill.json file from this project to your Watson instance 
* Clone this repository and add an `.env` file with the following variables:
  * WATSON_API_KEY
  * WATSON_SERVICE_URL
  * WATSON_ASSISTANT_ID
  
  If you are deploying the project to Netlify, you can add your env variables there instead.
* Run `npm i`
* Run `netlify dev`

