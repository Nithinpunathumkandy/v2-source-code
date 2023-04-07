import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionListComponent } from './corrective-action-list.component';

describe('CorrectiveActionListComponent', () => {
  let component: CorrectiveActionListComponent;
  let fixture: ComponentFixture<CorrectiveActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
