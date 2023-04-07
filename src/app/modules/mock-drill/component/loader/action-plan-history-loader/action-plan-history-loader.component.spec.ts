import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanHistoryLoaderComponent } from './action-plan-history-loader.component';

describe('ActionPlanHistoryLoaderComponent', () => {
  let component: ActionPlanHistoryLoaderComponent;
  let fixture: ComponentFixture<ActionPlanHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
