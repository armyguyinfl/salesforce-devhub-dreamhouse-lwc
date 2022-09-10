import { LightningElement, api, track, wire } from "lwc";

export default class OppCard extends LightningElement {
  @api amount;
  @api closeDate;
  @api name;
  @api oppId;
  @api stage;
}
