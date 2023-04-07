import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmityCorrectiveActionComponent } from './non-confirmity-corrective-action.component';

describe('NonConfirmityCorrectiveActionComponent', () => {
  let component: NonConfirmityCorrectiveActionComponent;
  let fixture: ComponentFixture<NonConfirmityCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmityCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmityCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
