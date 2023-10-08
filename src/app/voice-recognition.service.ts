import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;


@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  private recognition: typeof SpeechRecognition;
  private listening = false;
  voiceListener$ = new BehaviorSubject<SpeechRecognitionAlternative | null>(null);

  constructor() {
    this.recognition = new SpeechRecognition();
    this.recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
      this.voiceListener$.next(event.results.item(0).item(0));
    }
    this.recognition.onerror = (error: any) => console.error('error: ', error);
  }

  startSpeechToText() {
    if (this.listening) return;
    this.listening = true;
    this.recognition.start();
  }

  stopSpeechToText() {
    this.recognition.stop();
    this.listening = false;
  }

  readText(text:string){
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
}
