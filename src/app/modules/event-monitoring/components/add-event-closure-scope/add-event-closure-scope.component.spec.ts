import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventClosureScopeComponent } from './add-event-closure-scope.component';

describe('AddEventClosureScopeComponent', () => {
  let component: AddEventClosureScopeComponent;
  let fixture: ComponentFixture<AddEventClosureScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventClosureScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventClosureScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
