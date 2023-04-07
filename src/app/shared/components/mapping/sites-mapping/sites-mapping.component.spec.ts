import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesMappingComponent } from './sites-mapping.component';

describe('SitesMappingComponent', () => {
  let component: SitesMappingComponent;
  let fixture: ComponentFixture<SitesMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitesMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
