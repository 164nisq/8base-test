import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, InputField, ModalContext, DateInputField } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const CLIENTS_EDIT_DIALOG_ID = 'CLIENTS_EDIT_DIALOG_ID';

class ClientEditDialog extends React.Component {
  static contextType = ModalContext;

  createOnSubmit = id => async data => {
    await this.props.clientUpdate({ variables: { data: { ...data, id } } });

    this.context.closeModal(CLIENTS_EDIT_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENTS_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="Edit Listing" onClose={this.onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Field
              name="firstName"
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              component={InputField}
            />
          </Grid.Box>
          <Grid.Box>
            <Field
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              component={InputField}
            />
          </Grid.Box>
          <Grid.Box>
            <Field name="email" label="Email" type="text" placeholder="email" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="phone" label="Phone" type="text" placeholder="Phone" component={InputField} />
          </Grid.Box>
          <Grid.Box>
            <Field name="birthday" label="Birthday" component={DateInputField} />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" disabled={pristine || invalid} loading={submitting}>
          Update Client
        </Button>
      </Dialog.Footer>
    </form>
  );

  renderForm = ({ args }) => {
    return (
      <Form
        type="UPDATE"
        tableSchemaName="Clients"
        onSubmit={this.createOnSubmit(args.initialValues.id)}
        initialValues={args.initialValues}
        formatRelationToIds
      >
        {this.renderFormContent}
      </Form>
    );
  };

  render() {
    return (
      <Dialog id={CLIENTS_EDIT_DIALOG_ID} size="sm">
        {this.renderForm}
      </Dialog>
    );
  }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENTS_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfully updated',
    },
  },
})(ClientEditDialog);

ClientEditDialog.id = CLIENTS_EDIT_DIALOG_ID;

export { ClientEditDialog };
