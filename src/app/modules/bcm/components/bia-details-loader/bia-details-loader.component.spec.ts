import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaDetailsLoaderComponent } from './bia-details-loader.component';

describe('BiaDetailsLoaderComponent', () => {
  let component: BiaDetailsLoaderComponent;
  let fixture: ComponentFixture<BiaDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
