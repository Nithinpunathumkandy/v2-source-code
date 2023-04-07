import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanAccordionComponent } from './action-plan-accordion.component';

describe('ActionPlanAccordionComponent', () => {
  let component: ActionPlanAccordionComponent;
  let fixture: ComponentFixture<ActionPlanAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
