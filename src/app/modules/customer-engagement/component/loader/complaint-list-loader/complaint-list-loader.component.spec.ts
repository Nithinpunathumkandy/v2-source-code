import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintListLoaderComponent } from './complaint-list-loader.component';

describe('ComplaintListLoaderComponent', () => {
  let component: ComplaintListLoaderComponent;
  let fixture: ComponentFixture<ComplaintListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
