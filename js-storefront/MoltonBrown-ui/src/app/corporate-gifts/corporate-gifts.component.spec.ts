import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGiftsComponent } from './corporate-gifts.component';

describe('CorporateGiftsComponent', () => {
  let component: CorporateGiftsComponent;
  let fixture: ComponentFixture<CorporateGiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateGiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateGiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
