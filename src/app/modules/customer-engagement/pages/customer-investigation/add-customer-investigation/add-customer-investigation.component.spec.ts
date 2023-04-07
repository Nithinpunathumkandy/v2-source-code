import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerInvestigationComponent } from './add-customer-investigation.component';

describe('AddCustomerInvestigationComponent', () => {
  let component: AddCustomerInvestigationComponent;
  let fixture: ComponentFixture<AddCustomerInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerInvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
