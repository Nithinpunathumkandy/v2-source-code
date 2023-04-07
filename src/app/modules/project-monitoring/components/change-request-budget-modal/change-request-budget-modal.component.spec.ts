import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestBudgetModalComponent } from './change-request-budget-modal.component';

describe('ChangeRequestBudgetModalComponent', () => {
  let component: ChangeRequestBudgetModalComponent;
  let fixture: ComponentFixture<ChangeRequestBudgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestBudgetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestBudgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
