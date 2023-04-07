import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanHistoryModalComponent } from './action-plan-history-modal.component';

describe('ActionPlanHistoryModalComponent', () => {
  let component: ActionPlanHistoryModalComponent;
  let fixture: ComponentFixture<ActionPlanHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
