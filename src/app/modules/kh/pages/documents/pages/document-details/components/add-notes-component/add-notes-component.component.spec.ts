import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesComponentComponent } from './add-notes-component.component';

describe('AddNotesComponentComponent', () => {
  let component: AddNotesComponentComponent;
  let fixture: ComponentFixture<AddNotesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNotesComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
