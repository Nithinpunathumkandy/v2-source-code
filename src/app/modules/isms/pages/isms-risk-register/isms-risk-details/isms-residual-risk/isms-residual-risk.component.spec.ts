import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsResidualRiskComponent } from './isms-residual-risk.component';

describe('IsmsResidualRiskComponent', () => {
  let component: IsmsResidualRiskComponent;
  let fixture: ComponentFixture<IsmsResidualRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsResidualRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsResidualRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
