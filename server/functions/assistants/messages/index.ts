import {HandlerResponse} from "@netlify/functions/dist/function/handler_response";
import {z, ZodError} from 'zod';
import {HandlerEvent} from "@netlify/functions";
import {Assistant} from "../../../assistant";

export async function sendMessageToAssistant(event: HandlerEvent): Promise<HandlerResponse> {
  try {
    const data: SendMessageDto = sendMessageSchema.parse(JSON.parse(event.body ?? '{}'));
    const assistant = Assistant.instance();
    const messageResult = await assistant.sendMessage({
      sessionId: data.sessionId,
      text: data.text.replace(/\$&\/\(\)\[]\|#<\*>\\/, ' ')
    });
    const answer: any = messageResult.result.output.generic![0] ?? {text: 'Temo di non aver capito la tua richiesta, puoi ripetere per favore'};
    return {
      statusCode: 200,
      body: JSON.stringify({
        text: answer.text
      })
    }
  } catch (error: ZodError | unknown) {
    // TODO handle invalid session
    console.error(error);
    let response = {
      errorMessage: 'Unexpected error'
    };
    if (error instanceof ZodError) {
      response = {
        errorMessage: error.errors[0].message
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify(response)
    }
  }
}

export const sendMessageSchema = z.object({
  text: z.string(),
  sessionId: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, 'Invalid assistant sessionId')
}).required();

export type SendMessageDto = z.infer<typeof sendMessageSchema>;
