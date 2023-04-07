import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionHistoryModalComponent } from './corrective-action-history-modal.component';

describe('CorrectiveActionHistoryModalComponent', () => {
  let component: CorrectiveActionHistoryModalComponent;
  let fixture: ComponentFixture<CorrectiveActionHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
