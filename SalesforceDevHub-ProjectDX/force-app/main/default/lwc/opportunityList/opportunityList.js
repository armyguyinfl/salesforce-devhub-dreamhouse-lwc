import { LightningElement, api, track, wire } from "lwc";
import getOpportunities from "@salesforce/apex/OpportunityController.getOpportunities";
import getPicklistValues from "@salesforce/apex/OpportunityController.getPicklistValues";
import LOCALE from "@salesforce/i18n/locale";
import CURRENCY from "@salesforce/i18n/currency";

export default class OpportunityList extends LightningElement {
  @api displayedOpportunities; // Passed or Set Referenced Variable
  @api recordId; // Passed or Set Referenced Variable
  @api totalRecords = 0; // Passed or Set Referenced Variable
  @api status = "All"; // Passed or Set Referenced Variable

  @track label = "All"; // Internal property or variable
  @track results; // Internal property or variable
  @track allOpportunities; // Internal property or variable
  @track error; // Internal property or variable
  @track dataRetrieved = false; // Internal property or variable
  @track formattedAmount = 0; // Internal property or variable
  @track picklistValues; // Internal property or variable

  @api
  get amount() {
    // Override constructor getAmount method
    const numberFormat = new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: CURRENCY,
      currencyDisplay: "symbol"
    });
    return numberFormat.format(this.formattedAmount);
  }
  set amount(value) {
    // Override constructor setAmount method
    this.formattedAmount = value;
  }

  @wire(getOpportunities, { accountId: "$recordId" })
  wiredOpportunities(value) {
    this.results = value;
    if (this.results.data) {
      this.allOpportunities = this.results.data;
      this.displayedOpportunities = this.results.data;
      this.error = undefined;
      this.dataRetrieved = true;
      this.updateList();
    } else if (this.results.error) {
      this.error = this.results.error;
      this.dataRetrieved = false;
    }
  }

  @wire(getPicklistValues)
  wiredPicklistValues({ error, data }) {
    if (data) {
      this.picklistValues = data;
      console.log("Picklist values: " + JSON.stringify(this.picklistValues));
    } else if (error) {
      console.log("Error retrieving picklist values ");
      console.log("Error: " + JSON.stringify(error));
      this.error = error;
    }
  }

  handleChange(event) {
    this.status = event.detail.value;
    this.label = event.detail.label;
    console.log("HandleChangeEventStatus: " + this.status);
    this.updateList();
  }

  updateList() {
    var filter = [];
    var k = 0;
    var i;
    var o;
    this.formattedAmount = 0;
    if (this.dataRetrieved) {
      for (i = 0; i < this.allOpportunities.length; i++) {
        o = this.allOpportunities[i];
        // Check to see if it matches the filter
        console.log("StageName: " + o.StageName + " \nStatus: " + this.status);
        if (this.status !== "All") {
          if (this.status === "Open") {
            if (!o.IsClosed) {
              // This is open, so add it to the filter
              filter[k] = o;
              this.formattedAmount += o.Amount;
              console.log(
                "Formatted Amount from Opportunity: " +
                  this.formattedAmount +
                  "\nIteration #: " +
                  i
              );
              k++;
            }
          } else if (this.status === "Closed") {
            if (o.IsClosed) {
              // This is closed, so add it to the filter
              filter[k] = o;
              this.formattedAmount += o.Amount;
              k++;
            }
          } else if (this.status === o.StageName) {
            if (o.IsClosed) {
              // This is the stage filter, so add it to the filter
              filter[k] = o;
              this.formattedAmount += o.Amount;
              k++;
            }
          }
        } else {
          // Total the Amount
          this.formattedAmount += o.Amount;
          // Add the entire list to the filter
          filter = this.allOpportunities;
        }
      }
      this.displayedOpportunities = filter;
      this.totalRecords = this.displayedOpportunities.length;
    }
  }
}
