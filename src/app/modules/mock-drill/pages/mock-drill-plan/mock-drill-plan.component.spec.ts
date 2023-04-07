import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanComponent } from './mock-drill-plan.component';

describe('MockDrillPlanComponent', () => {
  let component: MockDrillPlanComponent;
  let fixture: ComponentFixture<MockDrillPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
