import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMappingLoaderComponent } from './risk-mapping-loader.component';

describe('RiskMappingLoaderComponent', () => {
  let component: RiskMappingLoaderComponent;
  let fixture: ComponentFixture<RiskMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
