import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionDetailsLoaderComponent } from './unsafe-action-details-loader.component';

describe('UnsafeActionDetailsLoaderComponent', () => {
  let component: UnsafeActionDetailsLoaderComponent;
  let fixture: ComponentFixture<UnsafeActionDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
