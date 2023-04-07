import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskContextDetailComponent } from './risk-context-detail.component';

describe('RiskContextDetailComponent', () => {
  let component: RiskContextDetailComponent;
  let fixture: ComponentFixture<RiskContextDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskContextDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskContextDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
