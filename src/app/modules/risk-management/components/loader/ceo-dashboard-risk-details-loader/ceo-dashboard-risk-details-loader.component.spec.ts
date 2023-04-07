import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoDashboardRiskDetailsLoaderComponent } from './ceo-dashboard-risk-details-loader.component';

describe('CeoDashboardRiskDetailsLoaderComponent', () => {
  let component: CeoDashboardRiskDetailsLoaderComponent;
  let fixture: ComponentFixture<CeoDashboardRiskDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeoDashboardRiskDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CeoDashboardRiskDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
