import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmployeeRecordFormWebPartStrings';
import EmployeeRecordForm from './components/EmployeeRecordForm';
import { IEmployeeRecordFormProps } from './components/IEmployeeRecordFormProps';

export interface IEmployeeRecordFormWebPartProps {
  description: string;
}

export default class EmployeeRecordFormWebPart extends BaseClientSideWebPart<IEmployeeRecordFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmployeeRecordFormProps> = React.createElement(
      EmployeeRecordForm,
      {
        url: this.context.pageContext.web.absoluteUrl,
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
