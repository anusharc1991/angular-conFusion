import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import 'rxjs/add/operator/switchMap';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
      trigger('visibility', [
          state('shown', style({
              transform: 'scale(1.0)', 
              opacity: 1
          })),
          state('hidden', style({
              transform: 'scale(1.0)',
              opacity: 0
          })),
          transition('* => *', animate('0.5s ease-in-out'))
      ])
  ]
})
export class DishdetailComponent implements OnInit {
    
    dish: Dish;
    dishcopy = null;
    dishIds: number[];
    prev: number;
    next: number;
    commentForm: FormGroup;
    newComment: Comment;
    errMess: string;
    visibility = 'shown';

    formErrors = {
        'author': '',
        'comment': ''
    };

    validationMessages = {
        'author': {
            'required': 'Author Name is required.',
            'minlength': 'Author Name must be at least 2 characters long.'
        },
        'comment': {
            'required': 'Comment is required.'
        }
    };

    constructor(private dishService: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private fb: FormBuilder,
        @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {

        this.createForm();

        this.dishService.getDishIds()
        .subscribe(dishIds => this.dishIds = dishIds);

        //let id = +this.route.snapshot.params['id'];
        this.route.params
        .switchMap((params: Params) => {
            this.visibility = 'hidden';
            return this.dishService.getDish(+params['id']);
        })
        .subscribe(dish => {
            this.dish = dish;
            this.dishcopy = dish;
            this.setPrevNext(dish.id);
            this.visibility = 'shown';
        },
        errmess => this.errMess = <any>errmess);
    }

    

    setPrevNext(dishId: number) {
        let index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    goBack(): void {
        this.location.back();
    }

    createForm() {
        this.commentForm = this.fb.group({
            author: ['', [Validators.required, Validators.minLength(2)]],
            rating: 5,
            comment: ['', Validators.required]
        });

        this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

        this.onValueChanged();

    }

    onValueChanged(data?: any) {
        if(!this.commentForm) { return; }
        const form = this.commentForm;

        for(const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if(control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for(const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }

        this.newComment = this.commentForm.value;
    }

    onSubmit() {
        this.newComment['date'] = new Date().toISOString();
        console.log(this.newComment);
        this.dishcopy.comments.push(this.newComment);
        this.dishcopy.save()
            .subscribe(dish => this.dish = dish);
        this.commentForm.reset({
            author: '',
            rating: 5,
            comment: ''
        });
    }

}
