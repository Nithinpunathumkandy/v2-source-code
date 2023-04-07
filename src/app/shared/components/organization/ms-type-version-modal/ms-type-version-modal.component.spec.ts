import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypeVersionModalComponent } from './ms-type-version-modal.component';

describe('MsTypeVersionModalComponent', () => {
  let component: MsTypeVersionModalComponent;
  let fixture: ComponentFixture<MsTypeVersionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypeVersionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypeVersionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
