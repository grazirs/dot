import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {first, tap} from "rxjs";
import {environment} from "../environments/environment";
import {db, Message} from "./db";
import {VoiceRecognitionService} from "./voice-recognition.service";

const BASE_URL = `${environment.baseUrl}/.netlify/functions/assistants`;
const INITIAL_MESSAGE: Message = {
  createdAt: new Date(),
  direction: 'RECEIVED',
  sender: "Dot",
  text: `Ciao, Mi chiamo Dot! Sono la tua nuova interfaccia per interagire con i servizi bancari. Posso darti
  informazioni sul saldo del tuo conto, eseguire bonifici, prendere appuntamenti in filiale e molto altro! Come posso aiutarti oggi?`
}

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  conversation: Message[] = [];
  sessionId: string | null = null;

  constructor(private http: HttpClient, private voiceRecognitionService: VoiceRecognitionService) {
    this.checkSession();
  }

  private async checkSession() {
    const now = new Date();
    const sessions = await db.sessions
      .where('lastInteractionAt')
      .above(new Date(now.getTime() - (24 * 60 * 60 * 1000)))
      .toArray();
    if (sessions[0]) this.sessionId = sessions[0].sessionId;
    else {
      await Promise.all([db.sessions.clear(), db.messages.clear()]);
      this.createSession()
        .pipe(first())
        .subscribe();
    }
  }

  private createSession() {
    return this.http.post<{ sessionId: string }>(`${BASE_URL}/create-session`, {}).pipe(tap(async (response) => {
      this.sessionId = response.sessionId;
      await db.sessions.add({
        sessionId: this.sessionId,
        lastInteractionAt: new Date(),
      });
      db.messages.add(INITIAL_MESSAGE);
      this.voiceRecognitionService.readText(INITIAL_MESSAGE.text);
    }));
  }

  private touchSession() {
    if (!this.sessionId) throw new Error('Can\'t touch unset session');
    db.sessions.update(this.sessionId, {
      sessionId: this.sessionId,
      lastInteractionAt: new Date(),
    })
  }

  get messages() {
    return db.messages.toArray();
  }

  sendMessage(text: string) {
    if (!this.sessionId) throw new Error('SessionId not set');
    db.messages.add(
      {
        createdAt: new Date(),
        direction: 'SENT',
        sender: "Tu",
        text,
      }
    );
    return this.http.post<{ text: string }>(`${BASE_URL}/message`, {sessionId: this.sessionId, text: text})
      .pipe(
        tap((result) => {
          this.touchSession();
          db.messages.add({
            createdAt: new Date(),
            direction: 'RECEIVED',
            sender: "Dot",
            text: result.text,
          })
        })
      );
  }
}
