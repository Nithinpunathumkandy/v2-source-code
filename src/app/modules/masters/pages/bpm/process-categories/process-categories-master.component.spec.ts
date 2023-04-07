import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCategoriesMasterComponent } from './process-categories-master.component';

describe('ProcessCategoriesMasterComponent', () => {
  let component: ProcessCategoriesMasterComponent;
  let fixture: ComponentFixture<ProcessCategoriesMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessCategoriesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCategoriesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
