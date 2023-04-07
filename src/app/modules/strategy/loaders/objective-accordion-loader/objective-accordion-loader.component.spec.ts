import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveAccordionLoaderComponent } from './objective-accordion-loader.component';

describe('ObjectiveAccordionLoaderComponent', () => {
  let component: ObjectiveAccordionLoaderComponent;
  let fixture: ComponentFixture<ObjectiveAccordionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveAccordionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveAccordionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
