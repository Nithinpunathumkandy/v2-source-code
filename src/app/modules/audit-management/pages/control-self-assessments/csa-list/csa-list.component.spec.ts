import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsaListComponent } from './csa-list.component';

describe('CsaListComponent', () => {
  let component: CsaListComponent;
  let fixture: ComponentFixture<CsaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
