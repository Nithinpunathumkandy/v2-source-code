import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCorrectiveActionHistoryModalComponent } from './customer-corrective-action-history-modal.component';

describe('CustomerCorrectiveActionHistoryModalComponent', () => {
  let component: CustomerCorrectiveActionHistoryModalComponent;
  let fixture: ComponentFixture<CustomerCorrectiveActionHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCorrectiveActionHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCorrectiveActionHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
