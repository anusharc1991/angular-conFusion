import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';
import { PROMOTION } from '../shared/promotions';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PromotionService {

    constructor() { }

    getPromotions(): Observable<Promotion[]> {
        return Observable.of(PROMOTION).delay(2000);
    }

    getPromotion(id: number): Observable<Promotion> {
        return Observable.of(PROMOTION.filter((promo) => (promo.id === id))[0]).delay(2000);
    }

    getFeaturedPromotion(): Observable<Promotion> {
        return Observable.of(PROMOTION.filter((promo) => (promo.featured))[0]).delay(2000);
    }

}
