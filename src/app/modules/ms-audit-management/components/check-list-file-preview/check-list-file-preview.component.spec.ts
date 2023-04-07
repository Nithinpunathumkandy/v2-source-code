import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListFilePreviewComponent } from './check-list-file-preview.component';

describe('CheckListFilePreviewComponent', () => {
  let component: CheckListFilePreviewComponent;
  let fixture: ComponentFixture<CheckListFilePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckListFilePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
