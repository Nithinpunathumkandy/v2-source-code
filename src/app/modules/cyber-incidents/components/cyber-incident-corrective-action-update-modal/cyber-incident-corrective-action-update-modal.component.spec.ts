import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionUpdateModalComponent } from './cyber-incident-corrective-action-update-modal.component';

describe('CyberIncidentCorrectiveActionUpdateModalComponent', () => {
  let component: CyberIncidentCorrectiveActionUpdateModalComponent;
  let fixture: ComponentFixture<CyberIncidentCorrectiveActionUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentCorrectiveActionUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentCorrectiveActionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
