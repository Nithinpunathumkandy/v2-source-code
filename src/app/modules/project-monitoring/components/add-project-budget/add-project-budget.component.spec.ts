import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectBudgetComponent } from './add-project-budget.component';

describe('AddProjectBudgetComponent', () => {
  let component: AddProjectBudgetComponent;
  let fixture: ComponentFixture<AddProjectBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectBudgetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
