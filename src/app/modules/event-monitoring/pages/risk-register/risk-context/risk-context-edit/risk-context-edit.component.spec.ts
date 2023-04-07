import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskContextEditComponent } from './risk-context-edit.component';

describe('RiskContextEditComponent', () => {
  let component: RiskContextEditComponent;
  let fixture: ComponentFixture<RiskContextEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskContextEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskContextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
