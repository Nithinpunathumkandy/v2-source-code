import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmityCorrectiveActionListComponent } from './non-confirmity-corrective-action-list.component';

describe('NonConfirmityCorrectiveActionListComponent', () => {
  let component: NonConfirmityCorrectiveActionListComponent;
  let fixture: ComponentFixture<NonConfirmityCorrectiveActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmityCorrectiveActionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmityCorrectiveActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
