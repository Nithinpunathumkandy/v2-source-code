import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionModalComponent } from './dimension-modal.component';

describe('DimensionModalComponent', () => {
  let component: DimensionModalComponent;
  let fixture: ComponentFixture<DimensionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimensionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
