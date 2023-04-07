import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsListLoaderComponent } from './assessments-list-loader.component';

describe('AssessmentsListLoaderComponent', () => {
  let component: AssessmentsListLoaderComponent;
  let fixture: ComponentFixture<AssessmentsListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentsListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
