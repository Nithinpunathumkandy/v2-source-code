import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCorrectiveActionUpdateModalComponent } from './customer-corrective-action-update-modal.component';

describe('CustomerCorrectiveActionUpdateModalComponent', () => {
  let component: CustomerCorrectiveActionUpdateModalComponent;
  let fixture: ComponentFixture<CustomerCorrectiveActionUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCorrectiveActionUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCorrectiveActionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
