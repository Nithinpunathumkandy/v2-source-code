import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoDashboardTopRiskLoaderComponent } from './ceo-dashboard-top-risk-loader.component';

describe('CeoDashboardTopRiskLoaderComponent', () => {
  let component: CeoDashboardTopRiskLoaderComponent;
  let fixture: ComponentFixture<CeoDashboardTopRiskLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeoDashboardTopRiskLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CeoDashboardTopRiskLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
