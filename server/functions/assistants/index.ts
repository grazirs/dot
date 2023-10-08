import {HandlerResponse} from "@netlify/functions/dist/function/handler_response";
import {Handler} from "@netlify/functions";
import {sendMessageToAssistant} from "./messages";
import {createAssistantSession} from "./sessions";

const BASE_URL = '.netlify/functions/assistants';
const WHITELIST_HOSTS = ['localhost', 'dot-assistant.netlify.app'];

export const handler: Handler = async (event, _): Promise<HandlerResponse> => {
  const domain = event.headers['host']?.split(':')[0] ?? 'unknown';

  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': (WHITELIST_HOSTS.includes(domain) && event.headers['origin']) ? event.headers['origin'] : 'null',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
    }
  }

  switch (true) {
    case new RegExp(`${BASE_URL}/create-session`).test(event.path): {
      if (event.httpMethod === 'POST') {
        const response = await createAssistantSession(event);
        return {
          headers: CORS_HEADERS,
          ...response,
        }
      }
      break;
    }
    case new RegExp(`${BASE_URL}/message`).test(event.path):
      if (event.httpMethod === 'POST') {
        const response = await sendMessageToAssistant(event);
        return {
          headers: CORS_HEADERS,
          ...response,
        }
      }
      break;
  }
  return {
    headers: CORS_HEADERS,
    statusCode: 404,
    body: JSON.stringify({message: 'Not Found'}),
  }
}

