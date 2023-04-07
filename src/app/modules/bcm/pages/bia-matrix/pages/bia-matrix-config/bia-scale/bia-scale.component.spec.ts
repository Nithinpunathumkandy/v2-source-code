import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaScaleComponent } from './bia-scale.component';

describe('BiaScaleComponent', () => {
  let component: BiaScaleComponent;
  let fixture: ComponentFixture<BiaScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaScaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
