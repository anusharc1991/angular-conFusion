import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

import 'rxjs/add/observable/of';

@Injectable()
export class LeaderService {

    constructor(private restangular: Restangular) { }

    getLeaders(): Observable<Leader[]> {
        return this.restangular.all('leadership').getList();
    }

    getLeader(id: number): Observable<Leader> {
        return this.restangular.one('leadership', id).get();
    }

    getFeaturedLeader(): Observable<Leader> {
       return this.restangular.all('leadership').getList({featured: true})
       .map(leadership => leadership[3]);
    }
}
