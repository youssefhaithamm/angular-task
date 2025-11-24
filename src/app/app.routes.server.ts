import { RenderMode, ServerRoute } from '@angular/ssr';
import { MOCK_PRODUCTS } from './mocks/products.mock';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      MOCK_PRODUCTS.map((product) => ({
        id: product.id.toString()
      }))
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
