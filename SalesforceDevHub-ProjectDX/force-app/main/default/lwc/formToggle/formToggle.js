import { LightningElement, track, api } from "lwc";
import GenWatt2 from "@salesforce/resourceUrl/GenWatt2";
import { loadStyle } from "lightning/platformResourceLoader";

export default class FormToggle extends LightningElement {
  /*Track for internal properties to track the state of the toggle*/
  @track editMode = false;
  @api recordId;

  handleChange(event) {
    this.editMode = !this.editMode;
  }
  handleCancel(event) {
    this.editMode = false;
  }
  handleSave(event) {
    this.editMode = false;
  }

  constructor() {
    super();
    loadStyle(this, GenWatt2).then(() => {
      /* callback */
    });
  }
}
