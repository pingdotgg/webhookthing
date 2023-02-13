export const substituteTemplate = (input: {
  template: string;
  sanitize?: boolean;
}) => {
  let { template, sanitize = false } = input;

  const regex = /\%%(.*?)%%/g;
  const matches = [];
  let match;

  // check if template contains any template variables `%%VARIABLE%%`
  while ((match = regex.exec(template))) {
    const variable = match[1]?.trim();
    const sanitizedString = `%%${variable}%%`;

    if (!variable || !process.env[variable]) {
      console.log(
        `\u001b[31m[ERROR] Environment variable ${variable} not found`
      );
      throw new Error(`Environment variable ${variable} not found`);
    }

    // if sanitize is true, replace the value with the sanitized string
    const value = sanitize ? sanitizedString : process.env[variable];

    // replace the template variable with the value
    template = template.replace(match[0], `${value}`);
  }

  // evaluate the template string
  template = eval("`" + template + "`");

  return template;
};
