import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhDocTypeViewMoreComponent } from './kh-doc-type-view-more.component';

describe('KhDocTypeViewMoreComponent', () => {
  let component: KhDocTypeViewMoreComponent;
  let fixture: ComponentFixture<KhDocTypeViewMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhDocTypeViewMoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhDocTypeViewMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
