import React, { Component } from 'react';
import { Blaze } from 'meteor/blaze';

const BlazeComponent = (props) => {
  const html = {
    __html: Blaze.toHTMLWithData(
      props.template,
      _.omit(props, 'template')
   )
  };

  return ( <span dangerouslySetInnerHTML={html} /> );
}

const blazeToReact =template => ({ templateProp, ...props }) => (
  <BlazeComponent __template__={templateProp} {...props} template={template} />
);

export { blazeToReact };
export default BlazeComponent;
