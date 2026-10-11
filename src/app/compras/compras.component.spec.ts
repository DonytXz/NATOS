import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ComprasComponent } from './compras.component';
import { ComprasService } from '../servicios/compras.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('ComprasComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoCompra: vi.fn(() => of([])),
      insertarCompra: vi.fn(() => of({})),
      modificarCompra: vi.fn(() => of({})),
      eliminarCompra: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [ComprasComponent],
      providers: [{ provide: ComprasService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ComprasComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoCompra).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","proveedor","id_articulo","descripcion_articulo","cantidad_articulo","precio_articulo"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "proveedor": "ejemplo",
      "id_articulo": "ejemplo",
      "descripcion_articulo": "ejemplo",
      "cantidad_articulo": "2",
      "precio_articulo": "2"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarCompra).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarCompra).not.toHaveBeenCalled();
    expect(service.eliminarCompra).not.toHaveBeenCalled();
  });
});
