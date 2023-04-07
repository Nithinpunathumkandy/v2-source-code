import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoMasterComponent } from './jso-master.component';

describe('JsoMasterComponent', () => {
  let component: JsoMasterComponent;
  let fixture: ComponentFixture<JsoMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
