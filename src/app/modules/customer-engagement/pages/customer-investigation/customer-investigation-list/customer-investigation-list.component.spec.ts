import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvestigationListComponent } from './customer-investigation-list.component';

describe('CustomerInvestigationListComponent', () => {
  let component: CustomerInvestigationListComponent;
  let fixture: ComponentFixture<CustomerInvestigationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInvestigationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvestigationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
