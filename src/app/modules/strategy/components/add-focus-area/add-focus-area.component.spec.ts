import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFocusAreaComponent } from './add-focus-area.component';

describe('AddFocusAreaComponent', () => {
  let component: AddFocusAreaComponent;
  let fixture: ComponentFixture<AddFocusAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFocusAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFocusAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
