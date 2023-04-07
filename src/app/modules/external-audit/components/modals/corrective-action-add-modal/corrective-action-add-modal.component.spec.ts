import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionAddModalComponent } from './corrective-action-add-modal.component';

describe('CorrectiveActionAddModalComponent', () => {
  let component: CorrectiveActionAddModalComponent;
  let fixture: ComponentFixture<CorrectiveActionAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
