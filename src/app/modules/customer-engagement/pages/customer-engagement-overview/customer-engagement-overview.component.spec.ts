import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEngagementOverviewComponent } from './customer-engagement-overview.component';

describe('CustomerEngagementOverviewComponent', () => {
  let component: CustomerEngagementOverviewComponent;
  let fixture: ComponentFixture<CustomerEngagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerEngagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEngagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
