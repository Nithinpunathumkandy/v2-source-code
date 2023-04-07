import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskFindingTypeComponent } from './risk-finding-type.component';

describe('RiskFindingTypeComponent', () => {
  let component: RiskFindingTypeComponent;
  let fixture: ComponentFixture<RiskFindingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskFindingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskFindingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
