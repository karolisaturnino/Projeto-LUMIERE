import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaBusca } from './pagina-busca';

describe('PaginaBusca', () => {
  let component: PaginaBusca;
  let fixture: ComponentFixture<PaginaBusca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaBusca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaBusca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
