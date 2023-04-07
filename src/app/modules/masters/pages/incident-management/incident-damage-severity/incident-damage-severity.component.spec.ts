import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDamageSeverityComponent } from './incident-damage-severity.component';

describe('IncidentDamageSeverityComponent', () => {
  let component: IncidentDamageSeverityComponent;
  let fixture: ComponentFixture<IncidentDamageSeverityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDamageSeverityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDamageSeverityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
