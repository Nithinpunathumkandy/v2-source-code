import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionModelComponent } from './unsafe-action-model.component';

describe('UnsafeActionModelComponent', () => {
  let component: UnsafeActionModelComponent;
  let fixture: ComponentFixture<UnsafeActionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
