import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalityRatingFormLoaderComponent } from './criticality-rating-form-loader.component';

describe('CriticalityRatingFormLoaderComponent', () => {
  let component: CriticalityRatingFormLoaderComponent;
  let fixture: ComponentFixture<CriticalityRatingFormLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriticalityRatingFormLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalityRatingFormLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
