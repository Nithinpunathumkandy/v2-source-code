import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintStatusComponent } from './customer-complaint-status.component';

describe('CustomerComplaintStatusComponent', () => {
  let component: CustomerComplaintStatusComponent;
  let fixture: ComponentFixture<CustomerComplaintStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
