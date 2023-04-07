import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixListLoaderComponent } from './maturity-matrix-list-loader.component';

describe('MaturityMatrixListLoaderComponent', () => {
  let component: MaturityMatrixListLoaderComponent;
  let fixture: ComponentFixture<MaturityMatrixListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
