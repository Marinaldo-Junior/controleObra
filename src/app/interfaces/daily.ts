import { Worker } from '../interfaces/worker';
import { Equipment } from './equipment';

export interface Daily {
    id?: string,
    date?: any
    description?: string,
    ref?: string,
    urlPhotos?: string[],
    equipments?: Equipment[],
    team?: Worker[],
}
