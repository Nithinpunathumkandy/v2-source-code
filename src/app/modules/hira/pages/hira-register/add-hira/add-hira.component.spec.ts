import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHiraComponent } from './add-hira.component';

describe('AddHiraComponent', () => {
  let component: AddHiraComponent;
  let fixture: ComponentFixture<AddHiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
