import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDamageSeverityModalComponent } from './incident-damage-severity-modal.component';

describe('IncidentDamageSeverityModalComponent', () => {
  let component: IncidentDamageSeverityModalComponent;
  let fixture: ComponentFixture<IncidentDamageSeverityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDamageSeverityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDamageSeverityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
