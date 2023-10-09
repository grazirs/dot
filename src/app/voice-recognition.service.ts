import {Injectable, NgZone} from '@angular/core';
import {Subject} from "rxjs";

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
  voices$ = new Subject<SpeechRecognitionAlternative | null>();
  listening$ = new Subject<boolean>();

  constructor(private zone: NgZone) {
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'it-IT';
    this.recognition.onresult = (event: { results: SpeechRecognitionResultList }) => {
      this.voices$.next(event.results.item(0).item(0));
    }
    this.recognition.onerror = () => this.listening$.next(false);
    this.recognition.onend = () => this.zone.run(() => this.listening$.next(false));
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
