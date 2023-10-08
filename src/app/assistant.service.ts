import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";
import {environment} from "../environments/environment";

const BASE_URL = `${environment.baseUrl}/.netlify/functions/assistants`;

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  voiceListener = new BehaviorSubject<string>('');
  conversation: Message[] = [
    {
      sender: 'Dot',
      text: 'Hi, I\'m dot!',
      direction: 'RECEIVED',
      createdAt: new Date(),
    }, {
      sender: 'You',
      text: 'Hi dot!',
      direction: 'SENT',
      createdAt: new Date(),
    }
  ];
  sessionId?: string;

  constructor(private http: HttpClient) {
  }

  createSession() {
    return this.http.post<{ sessionId: string }>(`${BASE_URL}/create-session`, {}).pipe(tap((response) => {
      this.sessionId = response.sessionId;
    }));
  }

  sendMessage(text: string) {
    if (!this.sessionId) throw new Error('SessionId not set');
    return this.http.post<{ text: string }>(`${BASE_URL}/message`, {sessionId: this.sessionId, text: text});
  }

  startSpeechToText() {
    // TODO
  }

  stopSpeechToText() {
    //TODO
  }

}

interface Message {
  sender: string;
  text: string;
  direction: 'RECEIVED' | 'SENT';
  createdAt: Date;
}
