import { CurrencyPipe } from '@angular/common';

export interface Equipment {
    uid?: string;
    description?: string;
    type?: string;
    acquisitionDate?: any;
    acquisitionCost?: CurrencyPipe;
    allocated?: boolean;
}
