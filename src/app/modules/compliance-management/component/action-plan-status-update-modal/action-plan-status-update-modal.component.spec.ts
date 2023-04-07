import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanStatusUpdateModalComponent } from './action-plan-status-update-modal.component';

describe('ActionPlanStatusUpdateModalComponent', () => {
  let component: ActionPlanStatusUpdateModalComponent;
  let fixture: ComponentFixture<ActionPlanStatusUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanStatusUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanStatusUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
