import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityMatrixCommonListComponent } from './maturity-matrix-common-list.component';

describe('MaturityMatrixCommonListComponent', () => {
  let component: MaturityMatrixCommonListComponent;
  let fixture: ComponentFixture<MaturityMatrixCommonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityMatrixCommonListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityMatrixCommonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
