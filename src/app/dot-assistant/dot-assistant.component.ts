import {ChangeDetectorRef, Component, ElementRef, NgZone, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {VoiceRecognitionService} from '../voice-recognition.service';
import {liveQuery} from "dexie";
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dot-assistant',
  templateUrl: './dot-assistant.component.html',
  styleUrls: ['./dot-assistant.component.scss'],
})
export class DotAssistantComponent {
  messages$ = liveQuery(() => this.assistantService.messages);
  textMessage = new FormControl('');
  listening$: Observable<boolean>;

  constructor(
    public assistantService: AssistantService,
    public voiceRecognitionService: VoiceRecognitionService,
    private cdr: ChangeDetectorRef,
  ) {
    this.listening$ = this.voiceRecognitionService.listening$;
    this.messages$.subscribe(() => this.cdr.detectChanges());
    this.voiceRecognitionService.voices$.subscribe((result) => {
      if (result?.transcript) this.sendMessage(result.transcript);
    });
  }

  startVoiceRecognition() {
    this.voiceRecognitionService.startSpeechToText();
  }

  sendMessage(text: string) {
    this.assistantService.sendMessage(text).subscribe((response) => {
      this.voiceRecognitionService.readText(response.text);
    })
  }

  submit() {
    if (this.textMessage.value) this.sendMessage(this.textMessage.value);
    this.textMessage.reset();
  }
}
