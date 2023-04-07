import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyScoringMatrixComponent } from './strategy-scoring-matrix.component';

describe('StrategyScoringMatrixComponent', () => {
  let component: StrategyScoringMatrixComponent;
  let fixture: ComponentFixture<StrategyScoringMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyScoringMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyScoringMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
