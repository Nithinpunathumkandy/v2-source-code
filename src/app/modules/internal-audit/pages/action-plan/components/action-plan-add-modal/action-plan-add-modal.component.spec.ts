import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanAddModalComponent } from './action-plan-add-modal.component';

describe('ActionPlanAddModalComponent', () => {
  let component: ActionPlanAddModalComponent;
  let fixture: ComponentFixture<ActionPlanAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPlanAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
