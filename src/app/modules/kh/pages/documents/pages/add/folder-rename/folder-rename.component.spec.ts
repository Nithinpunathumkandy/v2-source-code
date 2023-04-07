import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderRenameComponent } from './folder-rename.component';

describe('FolderRenameComponent', () => {
  let component: FolderRenameComponent;
  let fixture: ComponentFixture<FolderRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderRenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
