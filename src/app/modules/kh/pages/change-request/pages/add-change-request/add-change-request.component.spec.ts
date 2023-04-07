import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChangeRequestComponent } from './add-change-request.component';

describe('AddChangeRequestComponent', () => {
  let component: AddChangeRequestComponent;
  let fixture: ComponentFixture<AddChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
