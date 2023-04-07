import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewcomponentComponent } from './previewcomponent.component';

describe('PreviewcomponentComponent', () => {
  let component: PreviewcomponentComponent;
  let fixture: ComponentFixture<PreviewcomponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewcomponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
