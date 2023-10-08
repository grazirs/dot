import {HandlerResponse} from "@netlify/functions/dist/function/handler_response";
import {Handler} from "@netlify/functions";
import {sendMessageToAssistant} from "./messages";
import {createAssistantSession} from "./sessions";

const BASE_URL = '.netlify/functions/assistants';

export const handler: Handler = async (event, _): Promise<HandlerResponse> => {

  switch (true) {
    case new RegExp(`${BASE_URL}/create-session`).test(event.path): {
      if (event.httpMethod === 'POST') return createAssistantSession(event);
      break;
    }
    case new RegExp(`${BASE_URL}/message`).test(event.path):
      if (event.httpMethod === 'POST') return sendMessageToAssistant(event);
      break;
  }
  return {
    statusCode: 404,
    body: JSON.stringify({message: 'Not Found'}),
  }
}

