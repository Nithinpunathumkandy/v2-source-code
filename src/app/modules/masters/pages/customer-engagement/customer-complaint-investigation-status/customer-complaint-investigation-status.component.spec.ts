import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintInvestigationStatusComponent } from './customer-complaint-investigation-status.component';

describe('CustomerComplaintInvestigationStatusComponent', () => {
  let component: CustomerComplaintInvestigationStatusComponent;
  let fixture: ComponentFixture<CustomerComplaintInvestigationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintInvestigationStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintInvestigationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
