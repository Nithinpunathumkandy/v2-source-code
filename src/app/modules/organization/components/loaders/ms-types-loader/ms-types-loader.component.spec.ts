import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypesLoaderComponent } from './ms-types-loader.component';

describe('MsTypesLoaderComponent', () => {
  let component: MsTypesLoaderComponent;
  let fixture: ComponentFixture<MsTypesLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypesLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
