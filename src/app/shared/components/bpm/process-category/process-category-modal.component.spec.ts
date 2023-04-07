import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCategoryModalComponent } from './process-category-modal.component';

describe('ProcessCategoryModalComponent', () => {
  let component: ProcessCategoryModalComponent;
  let fixture: ComponentFixture<ProcessCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
