import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInfoLoaderComponent } from './test-info-loader.component';

describe('TestInfoLoaderComponent', () => {
  let component: TestInfoLoaderComponent;
  let fixture: ComponentFixture<TestInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
