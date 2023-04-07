import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHmByDepartmentComponent } from './isms-hm-by-department.component';

describe('IsmsHmByDepartmentComponent', () => {
  let component: IsmsHmByDepartmentComponent;
  let fixture: ComponentFixture<IsmsHmByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHmByDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHmByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
