import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintSourceComponent } from './customer-complaint-source.component';

describe('CustomerComplaintSourceComponent', () => {
  let component: CustomerComplaintSourceComponent;
  let fixture: ComponentFixture<CustomerComplaintSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
