import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAreaModalComponent } from './risk-area-modal.component';

describe('RiskAreaModalComponent', () => {
  let component: RiskAreaModalComponent;
  let fixture: ComponentFixture<RiskAreaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAreaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
