import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {VoiceRecognitionService} from '../voice-recognition.service';
import {FormControl} from '@angular/forms';
import {debounceTime, Observable} from 'rxjs';
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
      .pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((result) => {
        if (result?.transcript && result.transcript.length > 2) this.sendMessage(result.transcript);
      });
  }

  startVoiceRecognition() {
    if (!this.voiceRecognitionService.recognition) {
      const message =
        'Purtroppo il tuo browser non supporta ancora la funzionalità di SpeechToText. Puoi interagire con Dot usando la tastiera';
      this.voiceRecognitionService.readText(message);
      alert(message);
      return;
    }
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
