import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpActionPlanComponent } from './follow-up-action-plan.component';

describe('FollowUpActionPlanComponent', () => {
  let component: FollowUpActionPlanComponent;
  let fixture: ComponentFixture<FollowUpActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowUpActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
