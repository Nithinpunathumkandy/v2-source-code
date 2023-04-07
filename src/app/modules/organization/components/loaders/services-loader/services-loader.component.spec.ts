import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesLoaderComponent } from './services-loader.component';

describe('ServicesLoaderComponent', () => {
  let component: ServicesLoaderComponent;
  let fixture: ComponentFixture<ServicesLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
