import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizonLineLoaderComponent } from './horizon-line-loader.component';

describe('HorizonLineLoaderComponent', () => {
  let component: HorizonLineLoaderComponent;
  let fixture: ComponentFixture<HorizonLineLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizonLineLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizonLineLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
