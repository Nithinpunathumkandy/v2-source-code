import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanCapitalDashboardLoaderComponent } from './human-capital-dashboard-loader.component';

describe('HumanCapitalDashboardLoaderComponent', () => {
  let component: HumanCapitalDashboardLoaderComponent;
  let fixture: ComponentFixture<HumanCapitalDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumanCapitalDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanCapitalDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
