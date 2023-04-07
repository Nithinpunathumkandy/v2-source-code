import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplaintMappingComponent } from './customer-complaint-mapping.component';

describe('CustomerComplaintMappingComponent', () => {
  let component: CustomerComplaintMappingComponent;
  let fixture: ComponentFixture<CustomerComplaintMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplaintMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplaintMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
