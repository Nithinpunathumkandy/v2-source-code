import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseUnsafeActionModalComponent } from './close-unsafe-action-modal.component';

describe('CloseUnsafeActionModalComponent', () => {
  let component: CloseUnsafeActionModalComponent;
  let fixture: ComponentFixture<CloseUnsafeActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseUnsafeActionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseUnsafeActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
