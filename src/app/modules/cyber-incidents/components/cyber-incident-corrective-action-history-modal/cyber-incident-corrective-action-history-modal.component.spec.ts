import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionHistoryModalComponent } from './cyber-incident-corrective-action-history-modal.component';

describe('CyberIncidentCorrectiveActionHistoryModalComponent', () => {
  let component: CyberIncidentCorrectiveActionHistoryModalComponent;
  let fixture: ComponentFixture<CyberIncidentCorrectiveActionHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentCorrectiveActionHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentCorrectiveActionHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
