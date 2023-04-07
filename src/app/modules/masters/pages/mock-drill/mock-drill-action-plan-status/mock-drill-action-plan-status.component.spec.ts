import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillActionPlanStatusComponent } from './mock-drill-action-plan-status.component';

describe('MockDrillActionPlanStatusComponent', () => {
  let component: MockDrillActionPlanStatusComponent;
  let fixture: ComponentFixture<MockDrillActionPlanStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillActionPlanStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillActionPlanStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
