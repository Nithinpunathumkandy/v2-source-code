import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsActionPlanComponent } from './meetings-action-plan.component';

describe('MeetingsActionPlanComponent', () => {
  let component: MeetingsActionPlanComponent;
  let fixture: ComponentFixture<MeetingsActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
