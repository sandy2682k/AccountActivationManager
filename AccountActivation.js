import { LightningElement, api, track } from 'lwc';
import {  updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACTIVE_FIELD from '@salesforce/schema/Account.Active__c';
import SUMMARY_FIELD from '@salesforce/schema/Account.Account_Activation_Summary__c';

// This class handles the account activation process.
export default class AccountActivation extends LightningElement {
    @api recordId; // The ID of the record to be activated.
    @track summary; // The summary of the activation.

    // This method handles the change in the summary input field.
    handleSummaryChange(event) {
        this.summary = event.target.value;
    }

    // This method handles the account activation process.
    activateAccount() {
        // If the summary is not provided, an error toast message is displayed.
        if (!this.summary) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error activating account',
                    message: 'Account Activation Summary is required.',
                    variant: 'error'
                })
            );
            return;
        }

        // Prepare the fields for the update operation.
        const fields = {};
        fields['Id'] = this.recordId;
        fields[ACTIVE_FIELD.fieldApiName] = true;
        fields[SUMMARY_FIELD.fieldApiName] = this.summary;

        const recordInput = {fields};

        // Perform the update operation.
        updateRecord(recordInput)
            .then(() => {
                // If the update is successful, a success toast message is displayed.
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account activated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                // If the update fails, an error toast message is displayed.
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error activating account',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}
