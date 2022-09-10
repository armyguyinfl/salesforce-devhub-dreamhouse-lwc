import { LightningElement, track, api } from "lwc";
import GenWatt2 from "@salesforce/resourceUrl/GenWatt2";
import { loadStyle } from "lightning/platformResourceLoader";

export default class HelloWorld extends LightningElement {
  @api name = "World";
  constructor() {
    super();
    loadStyle(this, GenWatt2).then(() => {
      /* callback */
    });
  }
}
