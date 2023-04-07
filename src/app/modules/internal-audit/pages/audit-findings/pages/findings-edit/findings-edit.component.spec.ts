import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsEditComponent } from './findings-edit.component';

describe('FindingsEditComponent', () => {
  let component: FindingsEditComponent;
  let fixture: ComponentFixture<FindingsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
