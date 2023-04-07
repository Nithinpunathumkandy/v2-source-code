import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AclTableLoaderComponent } from './acl-table-loader.component';

describe('AclTableLoaderComponent', () => {
  let component: AclTableLoaderComponent;
  let fixture: ComponentFixture<AclTableLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AclTableLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AclTableLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
