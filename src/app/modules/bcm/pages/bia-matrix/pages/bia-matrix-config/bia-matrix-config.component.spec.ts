import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaMatrixConfigComponent } from './bia-matrix-config.component';

describe('BiaMatrixConfigComponent', () => {
  let component: BiaMatrixConfigComponent;
  let fixture: ComponentFixture<BiaMatrixConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaMatrixConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaMatrixConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
