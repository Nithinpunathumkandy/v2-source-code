import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixLoaderComponent } from './maturity-matrix-loader.component';

describe('MaturityMatrixLoaderComponent', () => {
  let component: MaturityMatrixLoaderComponent;
  let fixture: ComponentFixture<MaturityMatrixLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
