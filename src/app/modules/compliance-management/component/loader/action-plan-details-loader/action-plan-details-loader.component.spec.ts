import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanDetailsLoaderComponent } from './action-plan-details-loader.component';

describe('ActionPlanDetailsLoaderComponent', () => {
  let component: ActionPlanDetailsLoaderComponent;
  let fixture: ComponentFixture<ActionPlanDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
