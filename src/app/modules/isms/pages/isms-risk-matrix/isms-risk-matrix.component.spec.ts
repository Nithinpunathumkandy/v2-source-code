import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskMatrixComponent } from './isms-risk-matrix.component';

describe('IsmsRiskMatrixComponent', () => {
  let component: IsmsRiskMatrixComponent;
  let fixture: ComponentFixture<IsmsRiskMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
