import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanUpdateLoaderComponent } from './action-plan-update-loader.component';

describe('ActionPlanUpdateLoaderComponent', () => {
  let component: ActionPlanUpdateLoaderComponent;
  let fixture: ComponentFixture<ActionPlanUpdateLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanUpdateLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanUpdateLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
