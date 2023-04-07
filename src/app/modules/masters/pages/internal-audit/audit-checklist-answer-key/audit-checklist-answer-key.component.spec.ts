import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditChecklistAnswerKeyComponent } from './audit-checklist-answer-key.component';

describe('AuditChecklistAnswerKeyComponent', () => {
  let component: AuditChecklistAnswerKeyComponent;
  let fixture: ComponentFixture<AuditChecklistAnswerKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditChecklistAnswerKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditChecklistAnswerKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
