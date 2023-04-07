import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintListComponent } from './customer-complaint-list.component';

describe('CustomerComplaintListComponent', () => {
  let component: CustomerComplaintListComponent;
  let fixture: ComponentFixture<CustomerComplaintListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
