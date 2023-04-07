import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsInfoLoaderComponent } from './findings-info-loader.component';

describe('FindingsInfoLoaderComponent', () => {
  let component: FindingsInfoLoaderComponent;
  let fixture: ComponentFixture<FindingsInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
