import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionDetailsComponent } from './unsafe-action-details.component';

describe('UnsafeActionDetailsComponent', () => {
  let component: UnsafeActionDetailsComponent;
  let fixture: ComponentFixture<UnsafeActionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
