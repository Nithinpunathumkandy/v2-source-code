import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileIconTypeComponent } from './file-icon-type.component';

describe('FileIconTypeComponent', () => {
  let component: FileIconTypeComponent;
  let fixture: ComponentFixture<FileIconTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileIconTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileIconTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
