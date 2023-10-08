import { Component } from '@angular/core';
import { AssistantService, Message } from '../assistant.service';

@Component({
  selector: 'app-dot-assistant',
  templateUrl: './dot-assistant.component.html',
  styleUrls: ['./dot-assistant.component.scss']
})
export class DotAssistantComponent {
  messages: Message[] = [];

  constructor(private assistantService: AssistantService ){
    this.messages = this.assistantService.conversation;
  }

  startRecord(){
    this.assistantService.startSpeechToText();
  }

  stopRecord(){
    this.assistantService.stopSpeechToText();
  }
}
