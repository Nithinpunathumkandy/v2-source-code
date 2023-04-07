import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestItemsLoaderComponent } from './change-request-items-loader.component';

describe('ChangeRequestItemsLoaderComponent', () => {
  let component: ChangeRequestItemsLoaderComponent;
  let fixture: ComponentFixture<ChangeRequestItemsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestItemsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestItemsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
