import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkLoaderComponent } from './framework-loader.component';

describe('FrameworkLoaderComponent', () => {
  let component: FrameworkLoaderComponent;
  let fixture: ComponentFixture<FrameworkLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameworkLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
