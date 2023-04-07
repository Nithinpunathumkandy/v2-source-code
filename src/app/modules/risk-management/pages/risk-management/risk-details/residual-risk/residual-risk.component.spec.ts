import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidualRiskComponent } from './residual-risk.component';

describe('ResidualRiskComponent', () => {
  let component: ResidualRiskComponent;
  let fixture: ComponentFixture<ResidualRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidualRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidualRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
