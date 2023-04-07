import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanDetailsComponent } from './mock-drill-plan-details.component';

describe('MockDrillPlanDetailsComponent', () => {
  let component: MockDrillPlanDetailsComponent;
  let fixture: ComponentFixture<MockDrillPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPlanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
