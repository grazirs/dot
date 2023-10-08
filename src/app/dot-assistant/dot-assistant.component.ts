import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {VoiceRecognitionService} from '../voice-recognition.service';
import {liveQuery} from "dexie";
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dot-assistant',
  templateUrl: './dot-assistant.component.html',
  styleUrls: ['./dot-assistant.component.scss'],
})
export class DotAssistantComponent {
  messages$ = liveQuery(() => this.assistantService.messages);
  textMessage = new FormControl('');

  constructor(
    public assistantService: AssistantService,
    public voiceRecognitionService: VoiceRecognitionService,
    private cdr: ChangeDetectorRef
  ) {
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
