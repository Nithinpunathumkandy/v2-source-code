import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChangeRequestComponent } from './edit-change-request.component';

describe('EditChangeRequestComponent', () => {
  let component: EditChangeRequestComponent;
  let fixture: ComponentFixture<EditChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
