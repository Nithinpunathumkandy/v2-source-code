import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintInfoComponent } from './customer-complaint-info.component';

describe('CustomerComplaintInfoComponent', () => {
  let component: CustomerComplaintInfoComponent;
  let fixture: ComponentFixture<CustomerComplaintInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
