import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanStatusHistoryModalComponent } from './action-plan-status-history-modal.component';

describe('ActionPlanStatusHistoryModalComponent', () => {
  let component: ActionPlanStatusHistoryModalComponent;
  let fixture: ComponentFixture<ActionPlanStatusHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanStatusHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanStatusHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
