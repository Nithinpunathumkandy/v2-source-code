import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCauseCategoriesModalComponent } from './root-cause-categories-modal.component';

describe('RootCauseCategoriesModalComponent', () => {
  let component: RootCauseCategoriesModalComponent;
  let fixture: ComponentFixture<RootCauseCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCauseCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCauseCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
