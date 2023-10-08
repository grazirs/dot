import {Component, NgZone} from '@angular/core';
import {AssistantService, Message} from '../assistant.service';
import {VoiceRecognitionService} from '../voice-recognition.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dot-assistant',
  templateUrl: './dot-assistant.component.html',
  styleUrls: ['./dot-assistant.component.scss'],
})
export class DotAssistantComponent {
  messages: Message[] = [];
  textMessage = new FormControl('');

  constructor(
    public assistantService: AssistantService,
    private voiceRecognitionService: VoiceRecognitionService,
    private zone: NgZone,
  ) {
    this.messages = this.assistantService.conversation;
    this.voiceRecognitionService.voiceListener$.subscribe((result) => {
      if (result?.transcript) this.sendMessage(result.transcript);
    });
    if (!this.assistantService.sessionId) this.assistantService.createSession().subscribe();
  }

  startRecord() {
    this.voiceRecognitionService.startSpeechToText();
  }

  stopRecord() {
    this.voiceRecognitionService.stopSpeechToText();
  }

  sendMessage(text: string) {
    const message: Message = {
      sender: 'You',
      text,
      direction: 'SENT',
      createdAt: new Date(),
    }
    this.messages.push(message);
    this.assistantService.sendMessage(text).subscribe((response) => {
      const message: Message = {
        sender: 'Dot',
        text: response.text,
        direction: 'RECEIVED',
        createdAt: new Date(),
      }
      this.voiceRecognitionService.readText(response.text);
      this.zone.run(() => this.messages.push(message));
    })
  }

  submit() {
    if (this.textMessage.value) this.sendMessage(this.textMessage.value);
    this.textMessage.reset();
  }
}
