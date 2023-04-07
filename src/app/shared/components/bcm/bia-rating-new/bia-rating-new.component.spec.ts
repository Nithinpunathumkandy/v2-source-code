import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaRatingNewComponent } from './bia-rating-new.component';

describe('BiaRatingNewComponent', () => {
  let component: BiaRatingNewComponent;
  let fixture: ComponentFixture<BiaRatingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaRatingNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaRatingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
