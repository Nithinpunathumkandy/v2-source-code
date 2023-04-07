import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixComponent } from './maturity-matrix.component';

describe('MaturityMatrixComponent', () => {
  let component: MaturityMatrixComponent;
  let fixture: ComponentFixture<MaturityMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
