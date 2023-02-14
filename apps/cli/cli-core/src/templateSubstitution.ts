export const substituteTemplate = (input: {
  template: string;
  sanitize?: boolean;
}) => {
  const { template: defTemp, sanitize = false } = input;
  let template = defTemp;

  const regex = /\%%(.*?)%%/g;
  let match;

  // check if template contains any template variables `%%VARIABLE%%`
  while ((match = regex.exec(template))) {
    const variable = match[1]?.trim();

    if (!variable) {
      console.log(`\u001b[31m[ERROR] Invalid template configuration`);
      throw new Error(`Invalid template configuration`);
    }
    const sanitizedString = `%%${variable}%%`;

    const value = sanitize ? sanitizedString : process.env[variable];

    if (!value) {
      console.log(
        `\u001b[31m[ERROR] Environment variable ${variable} not found`
      );
      throw new Error(`Environment variable ${variable} not found`);
    }

    // replace the template variable with the value
    template = template.replace(match[0], `${value}`);
  }

  // evaluate the template string
  template = eval("`" + template + "`") as string;

  return template;
};
