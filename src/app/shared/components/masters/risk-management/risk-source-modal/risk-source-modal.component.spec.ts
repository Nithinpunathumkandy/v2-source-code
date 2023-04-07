import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskSourceModalComponent } from './risk-source-modal.component';

describe('RiskSourceModalComponent', () => {
  let component: RiskSourceModalComponent;
  let fixture: ComponentFixture<RiskSourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskSourceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
