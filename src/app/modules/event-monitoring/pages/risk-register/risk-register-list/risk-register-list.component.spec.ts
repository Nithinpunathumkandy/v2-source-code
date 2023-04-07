import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterListComponent } from './risk-register-list.component';

describe('RiskRegisterListComponent', () => {
  let component: RiskRegisterListComponent;
  let fixture: ComponentFixture<RiskRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
