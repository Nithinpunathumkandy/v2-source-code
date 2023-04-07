import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanStatusUpdateLoaderComponent } from './action-plan-status-update-loader.component';

describe('ActionPlanStatusUpdateLoaderComponent', () => {
  let component: ActionPlanStatusUpdateLoaderComponent;
  let fixture: ComponentFixture<ActionPlanStatusUpdateLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanStatusUpdateLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanStatusUpdateLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
