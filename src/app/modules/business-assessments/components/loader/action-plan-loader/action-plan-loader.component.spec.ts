import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanLoaderComponent } from './action-plan-loader.component';

describe('ActionPlanLoaderComponent', () => {
  let component: ActionPlanLoaderComponent;
  let fixture: ComponentFixture<ActionPlanLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
