export interface CatalogProduct {
  readonly id: number;
  readonly name: string;
  readonly apiName: string;
  readonly bundle: string;
  readonly material: string;
  readonly description: string;
  readonly price: number;
  readonly image: string;
}

// Existing identifiers, prices and API names; not a live stock guarantee.
export const CATALOG_PRODUCTS: readonly CatalogProduct[] = [
  { id: 1, name: 'Chep + tacón', apiName: 'x20 Chep + x30 Tacon  -40%', bundle: '20 Chep + 30 de tacón', material: 'Madera', description: 'Dos formatos de tarima en un mismo paquete.', price: 3960, image: 'assets/catalog-chep.webp' },
  { id: 2, name: 'Plástico · 100 piezas', apiName: 'x100 Plastico -30%', bundle: '100 tarimas de plástico', material: 'Plástico', description: 'Una opción de plástico para tu operación.', price: 17500, image: 'assets/catalog-plastic.webp' },
  { id: 3, name: 'Plástico + tacón', apiName: 'x20 Plastico + x30 Tacon  -40%', bundle: '20 de plástico + 30 de tacón', material: 'Mixto', description: 'Combina dos materiales en un paquete.', price: 3960, image: 'assets/catalog-pallet.webp' },
  { id: 4, name: 'Chep · 100 piezas', apiName: 'x100 Chep -30%', bundle: '100 tarimas Chep', material: 'Madera', description: 'El formato Chep en un paquete de 100 piezas.', price: 17500, image: 'assets/catalog-chep.webp' },
  { id: 5, name: 'Chep · 50 piezas', apiName: 'x50 Chep', bundle: '50 tarimas Chep', material: 'Madera', description: 'Un paquete de 50 piezas para planear tu pedido.', price: 9000, image: 'assets/catalog-chep.webp' },
  { id: 6, name: 'Medidas especiales', apiName: 'x50 Medidas especiales', bundle: '50 tarimas de medidas especiales', material: 'Madera', description: 'Confirma las medidas que necesita tu proyecto.', price: 15000, image: 'assets/catalog-custom.webp' },
  { id: 7, name: 'Tacón · 50 piezas', apiName: 'x50 Tacon', bundle: '50 tarimas de tacón', material: 'Madera', description: 'Tarimas de tacón en paquete de 50 piezas.', price: 7500, image: 'assets/catalog-pallet.webp' },
  { id: 8, name: 'Plástico · 50 piezas', apiName: 'x50 Plastico', bundle: '50 tarimas de plástico', material: 'Plástico', description: 'Elige la cantidad de paquetes para tu solicitud.', price: 12500, image: 'assets/catalog-plastic.webp' },
];

export function formatMxn(value: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(value);
}
