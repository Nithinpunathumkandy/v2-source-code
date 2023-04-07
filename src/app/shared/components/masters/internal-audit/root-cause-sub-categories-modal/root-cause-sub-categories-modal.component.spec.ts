import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCauseSubCategoriesModalComponent } from './root-cause-sub-categories-modal.component';

describe('RootCauseSubCategoriesModalComponent', () => {
  let component: RootCauseSubCategoriesModalComponent;
  let fixture: ComponentFixture<RootCauseSubCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCauseSubCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCauseSubCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
