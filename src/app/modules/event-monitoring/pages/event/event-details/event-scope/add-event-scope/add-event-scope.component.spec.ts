import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventScopeComponent } from './add-event-scope.component';

describe('AddEventScopeComponent', () => {
  let component: AddEventScopeComponent;
  let fixture: ComponentFixture<AddEventScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
