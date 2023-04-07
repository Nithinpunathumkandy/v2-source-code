import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCategoryMasterComponent } from './issue-category-master.component';

describe('IssueCategoryMasterComponent', () => {
  let component: IssueCategoryMasterComponent;
  let fixture: ComponentFixture<IssueCategoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCategoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
