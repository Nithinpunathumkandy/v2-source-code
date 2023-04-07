import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderDashboardComponent } from './stakeholder-dashboard.component';

describe('StakeholderDashboardComponent', () => {
  let component: StakeholderDashboardComponent;
  let fixture: ComponentFixture<StakeholderDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeholderDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
