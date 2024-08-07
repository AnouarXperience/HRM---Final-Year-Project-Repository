import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailscandidatComponent } from './detailscandidat.component';

describe('DetailscandidatComponent', () => {
  let component: DetailscandidatComponent;
  let fixture: ComponentFixture<DetailscandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailscandidatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailscandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
