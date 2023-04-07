import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashborderLoaderComponent } from './dashborder-loader.component';

describe('DashborderLoaderComponent', () => {
  let component: DashborderLoaderComponent;
  let fixture: ComponentFixture<DashborderLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashborderLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashborderLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
