import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCauseSubCategoriesComponent } from './root-cause-sub-categories.component';

describe('RootCauseSubCategoriesComponent', () => {
  let component: RootCauseSubCategoriesComponent;
  let fixture: ComponentFixture<RootCauseSubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCauseSubCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCauseSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
