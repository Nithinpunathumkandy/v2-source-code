import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterDetailsComponent } from './risk-register-context.component';

describe('RiskRegisterDetailsComponent', () => {
  let component: RiskRegisterDetailsComponent;
  let fixture: ComponentFixture<RiskRegisterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRegisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
