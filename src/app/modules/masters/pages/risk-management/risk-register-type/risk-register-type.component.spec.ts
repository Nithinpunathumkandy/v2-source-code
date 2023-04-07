import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterTypeComponent } from './risk-register-type.component';

describe('RiskRegisterTypeComponent', () => {
  let component: RiskRegisterTypeComponent;
  let fixture: ComponentFixture<RiskRegisterTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRegisterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
