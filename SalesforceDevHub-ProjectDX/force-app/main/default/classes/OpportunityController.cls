/**
 * @File Name          : OpportunityController.cls
 * @Description        :
 * @Author             : dkowalec@mdvip.com
 * @Group              :
 * @Last Modified By   : dkowalec@mdvip.com
 * @Last Modified On   : 12/13/2019, 1:22:42 PM
 * @Modification Log   :
 * Ver       Date            Author      		    Modification
 * 1.0    12/13/2019   dkowalec@mdvip.com     Initial Version
 **/
global with sharing class OpportunityController {
  @AuraEnabled(cacheable=true)
  global static List<Opportunity> getOpportunities(Id accountId) {
    List<Opportunity> opportunities = new List<Opportunity>();
    for (Opportunity o : [
      SELECT
        Id,
        AccountId,
        Name,
        StageName,
        Amount,
        CloseDate,
        IsClosed,
        IsWon,
        Owner.Name
      FROM Opportunity
      WHERE AccountId = :accountId
    ]) {
      opportunities.add(o);
    }
    return opportunities;
  }

  public class PicklistValue {
    @AuraEnabled
    public string label,
      value;
    PicklistValue(String val, String lab) {
      label = lab;
      value = val;
    }
  }

  @AuraEnabled(cacheable=true)
  public static PicklistValue[] getPicklistValues(
    String objectName,
    String fieldName
  ) {
    List<PicklistValue> values = new List<PicklistValue>();
    values.add(new PicklistValue('All', 'All'));
    values.add(new PicklistValue('Open', 'Open'));
    values.add(new PicklistValue('Closed', 'Closed'));
    // Go find the stage picklist and get the values from it
    Schema.DescribeFieldResult fieldResult = Opportunity.StageName.getDescribe();
    List<Schema.PicklistEntry> entries = fieldResult.getPicklistValues();
    for (Schema.PicklistEntry f : entries) {
      values.add(new PicklistValue(f.getValue(), f.getLabel()));
    }
    return values;
  }
}
