import { Component, inject } from '@angular/core';
import { ProveedoresService } from '../servicios/proveedores.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent {
  private readonly service = inject(ProveedoresService);
  readonly workspace: RecordWorkspace = {
    title: 'Proveedores',
    singular: 'Proveedor',
    group: 'Directorio',
    description: 'Organiza los contactos que abastecen tu operación.',
    nameKey: 'empresa',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "empresa",
        "label": "Empresa",
        "required": true
      },
      {
        "key": "nombre",
        "label": "Nombre",
        "required": true
      },
      {
        "key": "apellido_paterno",
        "label": "Apellido paterno"
      },
      {
        "key": "apellido_materno",
        "label": "Apellido materno"
      },
      {
        "key": "puesto",
        "label": "Puesto"
      },
      {
        "key": "rfc",
        "label": "RFC"
      },
      {
        "key": "tipo_persona",
        "label": "Tipo de persona",
        "hint": "Usa el valor registrado: por ejemplo, física o moral."
      }
    ],
    list: () => this.service.consultartodoProveedor(),
    create: record => this.service.insertarProveedor(record),
    update: record => this.service.modificarProveedor(record),
    remove: record => this.service.eliminarProveedor(record),
  };
}
