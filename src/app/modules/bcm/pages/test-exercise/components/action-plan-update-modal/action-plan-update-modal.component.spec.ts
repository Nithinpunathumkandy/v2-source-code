import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanUpdateModalComponent } from './action-plan-update-modal.component';

describe('ActionPlanUpdateModalComponent', () => {
  let component: ActionPlanUpdateModalComponent;
  let fixture: ComponentFixture<ActionPlanUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
