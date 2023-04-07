import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorrectiveActionModalComponent } from './add-corrective-action-modal.component';

describe('AddCorrectiveActionModalComponent', () => {
  let component: AddCorrectiveActionModalComponent;
  let fixture: ComponentFixture<AddCorrectiveActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCorrectiveActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorrectiveActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
