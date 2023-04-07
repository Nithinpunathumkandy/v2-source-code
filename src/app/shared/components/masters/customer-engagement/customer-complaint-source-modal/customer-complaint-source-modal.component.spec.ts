import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintSourceModalComponent } from './customer-complaint-source-modal.component';

describe('CustomerComplaintSourceModalComponent', () => {
  let component: CustomerComplaintSourceModalComponent;
  let fixture: ComponentFixture<CustomerComplaintSourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintSourceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintSourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
