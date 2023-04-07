import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDamageTypeComponent } from './incident-damage-type.component';

describe('IncidentDamageTypeComponent', () => {
  let component: IncidentDamageTypeComponent;
  let fixture: ComponentFixture<IncidentDamageTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDamageTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDamageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
