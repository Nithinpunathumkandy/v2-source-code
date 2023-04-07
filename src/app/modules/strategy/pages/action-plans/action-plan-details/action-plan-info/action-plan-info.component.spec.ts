import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanInfoComponent } from './action-plan-info.component';

describe('ActionPlanInfoComponent', () => {
  let component: ActionPlanInfoComponent;
  let fixture: ComponentFixture<ActionPlanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
