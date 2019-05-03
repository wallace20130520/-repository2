import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NguiInViewComponent } from './ngui-in-view.component';

describe('NguiInViewComponent', () => {
  let component: NguiInViewComponent;
  let fixture: ComponentFixture<NguiInViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NguiInViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NguiInViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
