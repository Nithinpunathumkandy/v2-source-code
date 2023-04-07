import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionUpdateModalComponent } from './corrective-action-update-modal.component';

describe('CorrectiveActionUpdateModalComponent', () => {
  let component: CorrectiveActionUpdateModalComponent;
  let fixture: ComponentFixture<CorrectiveActionUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
