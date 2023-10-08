import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotAssistantComponent } from './dot-assistant.component';

describe('DotAssistantComponent', () => {
  let component: DotAssistantComponent;
  let fixture: ComponentFixture<DotAssistantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DotAssistantComponent]
    });
    fixture = TestBed.createComponent(DotAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
