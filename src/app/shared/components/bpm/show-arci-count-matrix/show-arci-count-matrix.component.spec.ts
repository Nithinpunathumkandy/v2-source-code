import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowArciCountMatrixComponent } from './show-arci-count-matrix.component';

describe('ShowArciCountMatrixComponent', () => {
  let component: ShowArciCountMatrixComponent;
  let fixture: ComponentFixture<ShowArciCountMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowArciCountMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowArciCountMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
