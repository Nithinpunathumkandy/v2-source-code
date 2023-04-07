import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterComponent } from './risk-register.component';

describe('RiskRegisterComponent', () => {
  let component: RiskRegisterComponent;
  let fixture: ComponentFixture<RiskRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
