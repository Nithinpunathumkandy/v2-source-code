import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoDashboardAutomativeDivisionLoaderComponent } from './ceo-dashboard-automative-division-loader.component';

describe('CeoDashboardAutomativeDivisionLoaderComponent', () => {
  let component: CeoDashboardAutomativeDivisionLoaderComponent;
  let fixture: ComponentFixture<CeoDashboardAutomativeDivisionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeoDashboardAutomativeDivisionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CeoDashboardAutomativeDivisionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
