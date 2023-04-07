import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaMatrixDetailsComponent } from './bia-matrix-details.component';

describe('BiaMatrixDetailsComponent', () => {
  let component: BiaMatrixDetailsComponent;
  let fixture: ComponentFixture<BiaMatrixDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaMatrixDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaMatrixDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
