import {HandlerResponse} from "@netlify/functions/dist/function/handler_response";
import {Assistant} from "../../../assistant";
import {HandlerEvent} from "@netlify/functions";

export async function createAssistantSession(_: HandlerEvent): Promise<HandlerResponse> {
  const assistant = Assistant.instance();
  try {
    const session = await assistant.createSession();
    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: session.result.session_id
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorMessage: 'Unexpected error'
      })
    }
  }
}

