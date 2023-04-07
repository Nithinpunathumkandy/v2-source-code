import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCountTypeComponent } from './risk-count-type.component';

describe('RiskCountTypeComponent', () => {
  let component: RiskCountTypeComponent;
  let fixture: ComponentFixture<RiskCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
