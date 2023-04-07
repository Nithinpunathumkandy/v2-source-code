import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionStatusComponent } from './corrective-action-status.component';

describe('CorrectiveActionStatusComponent', () => {
  let component: CorrectiveActionStatusComponent;
  let fixture: ComponentFixture<CorrectiveActionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
