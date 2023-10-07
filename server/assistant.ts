import {AssistantV2} from "ibm-watson/sdk";
import {IamAuthenticator} from "ibm-watson/auth";

export class Assistant {
  private readonly assistantClient: AssistantV2;
  private readonly assistantId: string;

  private constructor(assistantClient: AssistantV2, assistantId: string) {
    this.assistantClient = assistantClient;
    this.assistantId = assistantId;
  }

  static instance(): Assistant {
    return new Assistant(new AssistantV2({
      version: '2023-05-23',
      authenticator: new IamAuthenticator({
        apikey: process.env['WATSON_API_KEY']!, //TODO
      }),
      serviceUrl: process.env['WATSON_SERVICE_URL'], //TODO
    }), process.env['WATSON_ASSISTANT_ID']!) //TODO
  }

  async createSession() {
    return this.assistantClient.createSession({
      assistantId: this.assistantId
    });
  }

  async sendMessage(data: { sessionId: string, text: string }) {
    return this.assistantClient.message({
      input: {
        message_type: 'text',
        text: data.text,
      },
      sessionId: data.sessionId,
      assistantId: this.assistantId
    });
  }
}
