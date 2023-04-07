import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionObservedGroupComponent } from './unsafe-action-observed-group.component';

describe('UnsafeActionObservedGroupComponent', () => {
  let component: UnsafeActionObservedGroupComponent;
  let fixture: ComponentFixture<UnsafeActionObservedGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionObservedGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionObservedGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
