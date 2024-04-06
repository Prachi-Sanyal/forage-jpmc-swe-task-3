import { ServerRespond } from './DataStreamer';

export interface Row {
  stock: string,
  top_ask_price: number,
  timestamp: Date,
  // Add new fields for ratio, upper_bound, lower_bound, price_abc, price_def, and trigger_alert
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  price_abc: number,
  price_def: number,
  trigger_alert?: number,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]) {
    const stockABC = serverResponds.find((el) => el.stock === 'ABC');
    const stockDEF = serverResponds.find((el) => el.stock === 'DEF');

    if (!stockABC || !stockDEF) {
      return [];
    }

    const priceABC = stockABC.top_ask && stockABC.top_ask.price || 0;
    const priceDEF = stockDEF.top_ask && stockDEF.top_ask.price || 0;

    const ratio = priceABC !== 0 && priceDEF !== 0 ? priceABC / priceDEF : 0;
    const upper_bound = ratio * 1.1; // Adjust upper bound calculation as per task
    const lower_bound = ratio * 0.99; // Adjust lower bound calculation as per task
    const trigger_alert = ratio > upper_bound || ratio < lower_bound ? ratio : undefined;

    const timestamp = new Date();

    return [{
      stock: 'ABC',
      top_ask_price: priceABC,
      timestamp,
      ratio,
      upper_bound,
      lower_bound,
      price_abc: priceABC,
      price_def: priceDEF,
      trigger_alert,
    }, {
      stock: 'DEF',
      top_ask_price: priceDEF,
      timestamp,
      ratio,
      upper_bound,
      lower_bound,
      price_abc: priceABC,
      price_def: priceDEF,
      trigger_alert,
    }];
  }
}
