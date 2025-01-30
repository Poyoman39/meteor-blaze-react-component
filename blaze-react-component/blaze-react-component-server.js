import React from 'react';
import { Blaze } from 'meteor/blaze';

const BlazeComponent = ({ template, ...props }) => {
  const html = {
    __html: Blaze.toHTMLWithData(
      template,
      props,
    ),
  };

  return <span dangerouslySetInnerHTML={html} />;
};

const blazeToReact = template => ({ templateProp, ...props }) => (
  <BlazeComponent __template__={templateProp} {...props} template={template} />
);

export { blazeToReact };
export default BlazeComponent;
