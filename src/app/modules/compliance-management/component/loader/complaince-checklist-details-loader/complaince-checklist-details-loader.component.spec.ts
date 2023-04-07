import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainceChecklistDetailsLoaderComponent } from './complaince-checklist-details-loader.component';

describe('ComplainceChecklistDetailsLoaderComponent', () => {
  let component: ComplainceChecklistDetailsLoaderComponent;
  let fixture: ComponentFixture<ComplainceChecklistDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplainceChecklistDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainceChecklistDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
