import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraMatrixComponent } from './hira-matrix.component';

describe('HiraMatrixComponent', () => {
  let component: HiraMatrixComponent;
  let fixture: ComponentFixture<HiraMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
