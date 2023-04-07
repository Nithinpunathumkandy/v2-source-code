import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriMasterComponent } from './kri-master.component';

describe('KriMasterComponent', () => {
  let component: KriMasterComponent;
  let fixture: ComponentFixture<KriMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KriMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
