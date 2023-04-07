import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskContextComponent } from './risk-context.component';

describe('RiskContextComponent', () => {
  let component: RiskContextComponent;
  let fixture: ComponentFixture<RiskContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
