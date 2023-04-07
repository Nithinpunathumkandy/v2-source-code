import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintDetailsComponent } from './customer-complaint-details.component';

describe('CustomerComplaintDetailsComponent', () => {
  let component: CustomerComplaintDetailsComponent;
  let fixture: ComponentFixture<CustomerComplaintDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
