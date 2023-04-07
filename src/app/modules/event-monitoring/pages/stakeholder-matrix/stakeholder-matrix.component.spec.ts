import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderMatrixComponent } from './stakeholder-matrix.component';

describe('StakeholderMatrixComponent', () => {
  let component: StakeholderMatrixComponent;
  let fixture: ComponentFixture<StakeholderMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeholderMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
