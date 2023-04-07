import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessContinuityStrategySolutionStatusComponent } from './business-continuity-strategy-solution-status.component';

describe('BusinessContinuityStrategySolutionStatusComponent', () => {
  let component: BusinessContinuityStrategySolutionStatusComponent;
  let fixture: ComponentFixture<BusinessContinuityStrategySolutionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessContinuityStrategySolutionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessContinuityStrategySolutionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
