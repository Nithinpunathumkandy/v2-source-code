import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHiraComponent } from './edit-hira.component';

describe('EditHiraComponent', () => {
  let component: EditHiraComponent;
  let fixture: ComponentFixture<EditHiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHiraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
