import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRcaLoaderComponent } from './risk-rca-loader.component';

describe('RiskRcaLoaderComponent', () => {
  let component: RiskRcaLoaderComponent;
  let fixture: ComponentFixture<RiskRcaLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRcaLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRcaLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
