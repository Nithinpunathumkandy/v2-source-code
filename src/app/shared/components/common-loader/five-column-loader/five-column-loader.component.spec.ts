import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveColumnLoaderComponent } from './five-column-loader.component';

describe('FiveColumnLoaderComponent', () => {
  let component: FiveColumnLoaderComponent;
  let fixture: ComponentFixture<FiveColumnLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveColumnLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveColumnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
