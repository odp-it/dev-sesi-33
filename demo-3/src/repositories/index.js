// Satu pintu ke lapisan data. Service hanya mengimpor dari file ini, jadi service,
// controller, route, validasi, dan kontrak API tidak berubah saat lapisan data diganti.
import { DATA_LAYER } from '../db/index.js';

const layer = DATA_LAYER === 'orm' ? await import('./orm/index.js') : await import('./sql/index.js');

export const { branchRepo, customerRepo, accountRepo, transferRepo, reportRepo } = layer;
