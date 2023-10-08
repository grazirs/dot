import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import {environment} from "../environments/environment";

const BASE_URL = `${environment.baseUrl}/.netlify/functions/assistants`;
const SESSION_DATA_KEY = 'DOT_SESSION';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  conversation: Message[] = [
    {
      sender: 'Dot',
      text: 'Hi, I\'m dot!',
      direction: 'RECEIVED',
      createdAt: new Date(),
    },
  ];
  sessionId: string | null = null;

  constructor(private http: HttpClient) {
    const storageData = localStorage.getItem(SESSION_DATA_KEY);
    if (storageData) {
      const sessionData = JSON.parse(storageData) as {
        sessionId: string;
        lastInteractionAt: string;
      };
      const now = new Date();
      if (sessionData.lastInteractionAt && now.getTime() - new Date(sessionData.lastInteractionAt).getTime() < (24 * 60 * 60 * 1000)) {
        this.sessionId = sessionData.sessionId;
      } else {
        localStorage.removeItem(SESSION_DATA_KEY);
      }
    }
  }

  createSession() {
    return this.http.post<{ sessionId: string }>(`${BASE_URL}/create-session`, {}).pipe(tap((response) => {
      this.sessionId = response.sessionId;
      this.touchSession()
    }));
  }

  touchSession() {
    localStorage.setItem(
      SESSION_DATA_KEY,
      JSON.stringify({
        sessionId: this.sessionId,
        lastInteractionAt: new Date(),
      })
    );
  }

  sendMessage(text: string) {
    if (!this.sessionId) throw new Error('SessionId not set');
    return this.http.post<{ text: string }>(`${BASE_URL}/message`, {sessionId: this.sessionId, text: text})
      .pipe(tap(() => this.touchSession()));
  }
}

export interface Message {
  sender: string;
  text: string;
  direction: 'RECEIVED' | 'SENT';
  createdAt: Date;
}
