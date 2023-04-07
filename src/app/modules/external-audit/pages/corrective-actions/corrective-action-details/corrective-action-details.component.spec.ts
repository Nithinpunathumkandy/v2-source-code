import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionDetailsComponent } from './corrective-action-details.component';

describe('CorrectiveActionDetailsComponent', () => {
  let component: CorrectiveActionDetailsComponent;
  let fixture: ComponentFixture<CorrectiveActionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
