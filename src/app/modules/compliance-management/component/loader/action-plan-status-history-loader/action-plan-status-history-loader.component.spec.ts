import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanStatusHistoryLoaderComponent } from './action-plan-status-history-loader.component';

describe('ActionPlanStatusHistoryLoaderComponent', () => {
  let component: ActionPlanStatusHistoryLoaderComponent;
  let fixture: ComponentFixture<ActionPlanStatusHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanStatusHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanStatusHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
