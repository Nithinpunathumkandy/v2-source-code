import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaMatrixComponent } from './bia-matrix.component';

describe('BiaMatrixComponent', () => {
  let component: BiaMatrixComponent;
  let fixture: ComponentFixture<BiaMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
