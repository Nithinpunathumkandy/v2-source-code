import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCorrectiveActionModalMsAuditComponent } from './history-corrective-action-modal-ms-audit.component';

describe('HistoryCorrectiveActionModalMsAuditComponent', () => {
  let component: HistoryCorrectiveActionModalMsAuditComponent;
  let fixture: ComponentFixture<HistoryCorrectiveActionModalMsAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCorrectiveActionModalMsAuditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCorrectiveActionModalMsAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
