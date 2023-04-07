import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerComplaintComponent } from './add-customer-complaint.component';

describe('AddCustomerComplaintComponent', () => {
  let component: AddCustomerComplaintComponent;
  let fixture: ComponentFixture<AddCustomerComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
