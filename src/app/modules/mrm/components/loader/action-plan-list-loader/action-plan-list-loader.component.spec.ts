import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanListLoaderComponent } from './action-plan-list-loader.component';

describe('ActionPlanListLoaderComponent', () => {
  let component: ActionPlanListLoaderComponent;
  let fixture: ComponentFixture<ActionPlanListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
