import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyMatrixComponent } from './competency-matrix.component';

describe('CompetencyMatrixComponent', () => {
  let component: CompetencyMatrixComponent;
  let fixture: ComponentFixture<CompetencyMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
