import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActionPlanComponent } from './add-action-plan.component';

describe('AddActionPlanComponent', () => {
  let component: AddActionPlanComponent;
  let fixture: ComponentFixture<AddActionPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddActionPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
