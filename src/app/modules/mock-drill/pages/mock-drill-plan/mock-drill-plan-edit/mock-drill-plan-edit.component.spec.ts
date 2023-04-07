import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillPlanEditComponent } from './mock-drill-plan-edit.component';

describe('MockDrillPlanEditComponent', () => {
  let component: MockDrillPlanEditComponent;
  let fixture: ComponentFixture<MockDrillPlanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillPlanEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillPlanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
