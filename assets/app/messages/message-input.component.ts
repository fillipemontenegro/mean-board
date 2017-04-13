import { Component, OnInit } from "@angular/core";
import { Message } from "./message.model";
import { MessageService } from "./message.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-message-input",
  templateUrl: "./message-input.component.html"
})

export class MessageInputComponent implements OnInit {
  message: Message;
  constructor (private messageService: MessageService) {}

  onClear(form: NgForm) {
    this.message = null;
    form.resetForm();
  }

  onSubmit(form: NgForm) {

    if(this.message){
      //Edit Message
      this.message.content = form.value.content;
      this.messageService.updateMessage(this.message)
      .subscribe(
        result => console.log(result)
      );
      this.message = null;
    } else {
      //Creating
      const message = new Message (form.value.content, 'Fillipe');
      this.messageService.addMessage(message)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
    }
    form.resetForm();
  }

  ngOnInit() {
    this.messageService.messageIsEdit.subscribe(
      (message: Message) => this.message = message
    );
  }
}
