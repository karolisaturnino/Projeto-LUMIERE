import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaFilmes } from './pagina-filmes';

describe('PaginaFilmes', () => {
  let component: PaginaFilmes;
  let fixture: ComponentFixture<PaginaFilmes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaFilmes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaFilmes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
