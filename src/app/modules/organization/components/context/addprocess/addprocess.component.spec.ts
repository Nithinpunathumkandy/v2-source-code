import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprocessComponent } from './addprocess.component';

describe('AddprocessComponent', () => {
  let component: AddprocessComponent;
  let fixture: ComponentFixture<AddprocessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprocessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
