import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansDetialsLoaderComponent } from './improvement-plans-detials-loader.component';

describe('ImprovementPlansDetialsLoaderComponent', () => {
  let component: ImprovementPlansDetialsLoaderComponent;
  let fixture: ComponentFixture<ImprovementPlansDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
