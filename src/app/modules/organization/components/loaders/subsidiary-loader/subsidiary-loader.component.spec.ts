import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryLoaderComponent } from './subsidiary-loader.component';

describe('SubsidiaryLoaderComponent', () => {
  let component: SubsidiaryLoaderComponent;
  let fixture: ComponentFixture<SubsidiaryLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
