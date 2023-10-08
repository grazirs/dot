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
  voices$ = new BehaviorSubject<SpeechRecognitionAlternative | null>(null);
  listening$ = new BehaviorSubject(false);

  constructor() {
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'it-IT';
    this.recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
      this.voices$.next(event.results.item(0).item(0));
    }
    this.recognition.onerror = (error: any) => console.error('error: ', error);
    this.recognition.onend = () => this.listening$.next(false);
  }

  startSpeechToText() {
    this.listening$.next(true);
    this.recognition.start();
  }

  readText(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
}
