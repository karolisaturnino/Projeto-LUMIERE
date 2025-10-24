import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaDetalhes } from './pagina-detalhes';

describe('PaginaDetalhes', () => {
  let component: PaginaDetalhes;
  let fixture: ComponentFixture<PaginaDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
