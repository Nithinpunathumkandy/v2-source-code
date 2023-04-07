import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesDetialsLoaderComponent } from './policies-detials-loader.component';

describe('PoliciesDetialsLoaderComponent', () => {
  let component: PoliciesDetialsLoaderComponent;
  let fixture: ComponentFixture<PoliciesDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliciesDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
