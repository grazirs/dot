import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {VoiceRecognitionService} from '../voice-recognition.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {liveQuery} from "dexie";
import {db} from "../db";

@UntilDestroy()
@Component({
  selector: 'app-dot-assistant',
  templateUrl: './dot-assistant.component.html',
  styleUrls: ['./dot-assistant.component.scss'],
})
export class DotAssistantComponent implements OnInit {
  messages$ = liveQuery(() => db.messages.toArray())
  textMessage = new FormControl('');
  listening$: Observable<boolean>;

  constructor(
    public assistantService: AssistantService,
    public voiceRecognitionService: VoiceRecognitionService,
    private cdr: ChangeDetectorRef,
  ) {
    this.listening$ = this.voiceRecognitionService.listening$;
  }

  ngOnInit() {
    this.messages$.subscribe(() => this.cdr.detectChanges());
    this.voiceRecognitionService.voices$
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
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
