import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionHistoryComponent } from './corrective-action-history.component';

describe('CorrectiveActionHistoryComponent', () => {
  let component: CorrectiveActionHistoryComponent;
  let fixture: ComponentFixture<CorrectiveActionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
