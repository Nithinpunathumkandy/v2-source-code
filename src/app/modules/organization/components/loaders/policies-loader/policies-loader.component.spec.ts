import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciesLoaderComponent } from './policies-loader.component';

describe('PoliciesLoaderComponent', () => {
  let component: PoliciesLoaderComponent;
  let fixture: ComponentFixture<PoliciesLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciesLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
