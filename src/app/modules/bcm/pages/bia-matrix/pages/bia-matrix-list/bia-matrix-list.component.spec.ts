import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaMatrixListComponent } from './bia-matrix-list.component';

describe('BiaMatrixListComponent', () => {
  let component: BiaMatrixListComponent;
  let fixture: ComponentFixture<BiaMatrixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaMatrixListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaMatrixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
