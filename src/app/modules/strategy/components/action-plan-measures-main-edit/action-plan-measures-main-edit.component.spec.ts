import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanMeasuresMainEditComponent } from './action-plan-measures-main-edit.component';

describe('ActionPlanMeasuresMainEditComponent', () => {
  let component: ActionPlanMeasuresMainEditComponent;
  let fixture: ComponentFixture<ActionPlanMeasuresMainEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanMeasuresMainEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanMeasuresMainEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
