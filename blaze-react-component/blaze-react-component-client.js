import React, { useCallback, useEffect, useRef } from 'react';
import { Blaze } from 'meteor/blaze';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

const BlazeReactComponent = ({
  template: blazeTemplateOrTemplateName,
  __template__,
  ...props
}) => {
  const blazeData = {
    template: __template__,
    ...props,
  };
  const containerRef = useRef();
  const reactiveBlazeDataRef = useRef(new ReactiveVar(blazeData));
  const blazeViewRef = useRef();

  const getTemplate = useCallback(() => {
    if (typeof blazeTemplateOrTemplateName === 'string') {
      if (!Template[blazeTemplateOrTemplateName]) {
        throw new Error([
          `No Template["${blazeTemplateOrTemplateName}"] exists.  If this template`,
          'originates in your app, make sure you have the `templating`',
          'package installed (and not, for e.g. `static-html`)',
        ].join(' '));
      }

      return Template[blazeTemplateOrTemplateName];
    }

    if (blazeTemplateOrTemplateName instanceof Blaze.Template) {
      return blazeTemplateOrTemplateName;
    }

    throw new Error([
      'Invalid template= argument specified.  Expected',
      'the string name of an existing Template, or the template',
      `itself, instead got '${typeof blazeTemplateOrTemplateName}':`,
      JSON.stringify(blazeTemplateOrTemplateName),
    ].join(' '));
  }, [blazeTemplateOrTemplateName]);

  // Render Blaze View;
  useEffect(() => {
    const template = getTemplate();

    blazeViewRef.current = Blaze.renderWithData(
      template,
      () => reactiveBlazeDataRef.current.get(),
      containerRef.current,
    );

    return () => {
      Blaze.remove(blazeViewRef.current);
    };

    // Never render() for props except template again; Blaze will do what's necessary.
  }, [blazeTemplateOrTemplateName]);

  useEffect(() => {
    reactiveBlazeDataRef.current.set(blazeData);
  }, [blazeData]);

  return <span style={{ display: 'contents' }} ref={containerRef} />;
};

const blazeToReact = template => ({ templateProp, ...props }) => (
  <BlazeReactComponent __template__={templateProp} {...props} template={template} />
);

export { blazeToReact };
export default BlazeReactComponent;
