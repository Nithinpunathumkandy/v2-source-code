import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDamageTypeModalComponent } from './incident-damage-type-modal.component';

describe('IncidentDamageTypeModalComponent', () => {
  let component: IncidentDamageTypeModalComponent;
  let fixture: ComponentFixture<IncidentDamageTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDamageTypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDamageTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
