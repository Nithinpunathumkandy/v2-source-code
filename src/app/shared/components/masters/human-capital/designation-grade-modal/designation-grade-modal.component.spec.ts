import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationGradeModalComponent } from './designation-grade-modal.component';

describe('DesignationGradeModalComponent', () => {
  let component: DesignationGradeModalComponent;
  let fixture: ComponentFixture<DesignationGradeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationGradeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationGradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
