import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/shared/services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})

export class ContactComponent implements OnInit, OnDestroy {

  contactForm: FormGroup;
  messageSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private toastr: ToastrService
  ) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.messageSubscription = this.contactService.getMessages().subscribe(res => {
    })
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  onSubmit() {
    const message = this.contactForm.value;

    this.contactService.addMessage(message).subscribe(
      updatedMessages => {
        this.contactForm.reset();
        this.toastr.success('Message sent successfully', 'Success');
      },
      error => {
        console.error('Error sending message:', error);
        this.toastr.error('An error occurred', 'Error');
      }
    );
  }
}
