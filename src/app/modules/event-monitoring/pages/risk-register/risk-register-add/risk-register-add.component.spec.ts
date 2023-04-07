import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterAddComponent } from './risk-register-add.component';

describe('RiskRegisterAddComponent', () => {
  let component: RiskRegisterAddComponent;
  let fixture: ComponentFixture<RiskRegisterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRegisterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
