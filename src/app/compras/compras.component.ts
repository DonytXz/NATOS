import { Component, inject } from '@angular/core';
import { ComprasService } from '../servicios/compras.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
})
export class ComprasComponent {
  private readonly service = inject(ComprasService);
  readonly workspace: RecordWorkspace = {
    title: 'Compras',
    singular: 'Compra',
    group: 'Operaciones',
    description: 'Consulta y registra las solicitudes de compra a proveedores.',
    nameKey: 'descripcion_articulo',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "proveedor",
        "label": "Proveedor",
        "required": true
      },
      {
        "key": "id_articulo",
        "label": "Código de artículo",
        "required": true
      },
      {
        "key": "descripcion_articulo",
        "label": "Descripción del artículo",
        "required": true
      },
      {
        "key": "cantidad_articulo",
        "label": "Cantidad",
        "required": true,
        "kind": "number",
        "min": 1,
        "integer": true
      },
      {
        "key": "precio_articulo",
        "label": "Precio (MXN)",
        "required": true,
        "kind": "money",
        "min": 0.01
      }
    ],
    list: () => this.service.consultartodoCompra(),
    create: record => this.service.insertarCompra(record),
    update: record => this.service.modificarCompra(record),
    remove: record => this.service.eliminarCompra(record),
  };
}
