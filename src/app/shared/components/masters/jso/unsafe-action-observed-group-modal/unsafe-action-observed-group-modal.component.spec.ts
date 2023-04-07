import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsafeActionObservedGroupModalComponent } from './unsafe-action-observed-group-modal.component';

describe('UnsafeActionObservedGroupModalComponent', () => {
  let component: UnsafeActionObservedGroupModalComponent;
  let fixture: ComponentFixture<UnsafeActionObservedGroupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsafeActionObservedGroupModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsafeActionObservedGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
