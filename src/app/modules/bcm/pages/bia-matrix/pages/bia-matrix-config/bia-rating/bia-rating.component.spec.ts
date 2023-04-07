import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaRatingComponent } from './bia-rating.component';

describe('BiaRatingComponent', () => {
  let component: BiaRatingComponent;
  let fixture: ComponentFixture<BiaRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
