import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventScopeChangeRequestComponent } from './edit-event-scope-change-request.component';

describe('EditEventScopeChangeRequestComponent', () => {
  let component: EditEventScopeChangeRequestComponent;
  let fixture: ComponentFixture<EditEventScopeChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventScopeChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventScopeChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
