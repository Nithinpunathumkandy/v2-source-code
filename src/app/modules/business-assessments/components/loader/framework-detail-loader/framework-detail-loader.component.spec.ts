import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkDetailLoaderComponent } from './framework-detail-loader.component';

describe('FrameworkDetailLoaderComponent', () => {
  let component: FrameworkDetailLoaderComponent;
  let fixture: ComponentFixture<FrameworkDetailLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameworkDetailLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkDetailLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
