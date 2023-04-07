import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskRegisterComponent } from './add-risk-register.component';

describe('AddRiskRegisterComponent', () => {
  let component: AddRiskRegisterComponent;
  let fixture: ComponentFixture<AddRiskRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
