import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionStatusesComponent } from './cyber-incident-corrective-action-statuses.component';

describe('CyberIncidentCorrectiveActionStatusesComponent', () => {
  let component: CyberIncidentCorrectiveActionStatusesComponent;
  let fixture: ComponentFixture<CyberIncidentCorrectiveActionStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentCorrectiveActionStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentCorrectiveActionStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
