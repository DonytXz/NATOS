import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresService } from '../servicios/proveedores.service';
import { RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

describe('ProveedoresComponent', () => {
  it('loads and saves the existing entity contract through its service', async () => {
    const service = {
      consultartodoProveedor: vi.fn(() => of([])),
      insertarProveedor: vi.fn(() => of({})),
      modificarProveedor: vi.fn(() => of({})),
      eliminarProveedor: vi.fn(() => of({})),
    };
    await TestBed.configureTestingModule({
      imports: [ProveedoresComponent],
      providers: [{ provide: ProveedoresService, useValue: service }],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProveedoresComponent);
    fixture.detectChanges();
    const workspace = fixture.debugElement.query(By.directive(RecordWorkspaceComponent)).componentInstance as RecordWorkspaceComponent;
    expect(service.consultartodoProveedor).toHaveBeenCalledTimes(1);
    expect(workspace.config.fields.map(field => field.key)).toEqual(["id","empresa","nombre","apellido_paterno","apellido_materno","puesto","rfc","tipo_persona"]);
    workspace.create();
    const payload = {
      "id": "ejemplo",
      "empresa": "ejemplo",
      "nombre": "ejemplo",
      "apellido_paterno": "ejemplo",
      "apellido_materno": "ejemplo",
      "puesto": "ejemplo",
      "rfc": "ejemplo",
      "tipo_persona": "ejemplo"
    };
    workspace.draft = { ...payload };
    workspace.save();
    expect(service.insertarProveedor).toHaveBeenCalledExactlyOnceWith(payload);
    expect(service.modificarProveedor).not.toHaveBeenCalled();
    expect(service.eliminarProveedor).not.toHaveBeenCalled();
  });
});
