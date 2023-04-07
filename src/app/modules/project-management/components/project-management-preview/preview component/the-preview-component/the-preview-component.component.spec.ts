import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThePreviewComponentComponent } from './the-preview-component.component';

describe('ThePreviewComponentComponent', () => {
  let component: ThePreviewComponentComponent;
  let fixture: ComponentFixture<ThePreviewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThePreviewComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThePreviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
