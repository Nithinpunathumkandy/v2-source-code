import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaMastersComponent } from './ba-masters.component';

describe('BaMastersComponent', () => {
  let component: BaMastersComponent;
  let fixture: ComponentFixture<BaMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
