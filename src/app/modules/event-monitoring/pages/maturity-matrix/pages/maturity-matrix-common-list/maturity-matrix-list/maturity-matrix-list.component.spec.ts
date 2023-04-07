import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixListComponent } from './maturity-matrix-list.component';

describe('MaturityMatrixListComponent', () => {
  let component: MaturityMatrixListComponent;
  let fixture: ComponentFixture<MaturityMatrixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
