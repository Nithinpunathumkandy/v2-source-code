import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanDetalsLoaderComponent } from './action-plan-detals-loader.component';

describe('ActionPlanDetalsLoaderComponent', () => {
  let component: ActionPlanDetalsLoaderComponent;
  let fixture: ComponentFixture<ActionPlanDetalsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanDetalsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanDetalsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
