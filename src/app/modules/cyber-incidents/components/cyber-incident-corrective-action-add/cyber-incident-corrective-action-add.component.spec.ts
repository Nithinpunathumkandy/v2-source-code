import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentCorrectiveActionAddComponent } from './cyber-incident-corrective-action-add.component';

describe('CyberIncidentCorrectiveActionAddComponent', () => {
  let component: CyberIncidentCorrectiveActionAddComponent;
  let fixture: ComponentFixture<CyberIncidentCorrectiveActionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentCorrectiveActionAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentCorrectiveActionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
