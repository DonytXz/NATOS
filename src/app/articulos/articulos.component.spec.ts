import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ArticulosComponent } from './articulos.component';
import { ArticulosService } from '../servicios/articulos.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('ArticulosComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoArticulo: vi.fn(() => of([])),
      insertarArticulo: vi.fn(() => of({})),
      modificarArticulo: vi.fn(() => of({})),
      eliminarArticulo: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [ArticulosComponent],
      providers: [{ provide: ArticulosService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ArticulosComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoArticulo).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","descripcion","cantidad","precio","proveedor"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "descripcion": "ejemplo",
      "cantidad": "2",
      "precio": "2",
      "proveedor": "ejemplo"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarArticulo).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarArticulo).not.toHaveBeenCalled();
    expect(service.eliminarArticulo).not.toHaveBeenCalled();
  });
});
