import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCauseCategoriesComponent } from './root-cause-categories.component';

describe('RootCauseCategoriesComponent', () => {
  let component: RootCauseCategoriesComponent;
  let fixture: ComponentFixture<RootCauseCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCauseCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCauseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
