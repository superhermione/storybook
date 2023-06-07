import { Meta, StoryObj } from "@storybook/react";
import { SyntaxHighlighter } from "./SyntaxHighlighter";
import React from "react";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { textContentMatcher } from "../../helpers/textContentMatcher";

const meta: Meta<typeof SyntaxHighlighter> = {
  component: SyntaxHighlighter,
  parameters: {
    chromatic: { delay: 300 },
  },
};

export default meta;

type Story = StoryObj<typeof SyntaxHighlighter>;

const newData = [
  [
    {
      code: `// Button.stories.tsx`,
    },
  ],
  [
    {
      code: `import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';`,
    },
  ],
  [
    {
      code: `const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  // ...
};
    
export default meta;`,
    },
  ],
  [
    { code: `export const Primary: Story = {` },
    {
      code: `args: {
    primary: true,
    label: 'Click',
    background: 'red'
  }`,
      toggle: true,
    },
    { code: `};` },
  ],
  [
    {
      code: `// Copy the code below

export const Warning: Story = {
  args: {
    backgroundColor: 'red',
    label: 'Delete now'
  }
};`,
    },
  ],
];

export const Default: Story = {
  render: (args) => {
    const [activeStep, setActiveStep] = React.useState(1);

    return (
      <div>
        <SyntaxHighlighter {...args} activeStep={activeStep} />
        <button onClick={() => setActiveStep(0)}>Reset</button>
        <button onClick={() => setActiveStep((step) => step - 1)}>
          Previous
        </button>
        <button onClick={() => setActiveStep((step) => step + 1)}>Next</button>
      </div>
    );
  },
  args: {
    data: newData,
    activeStep: 1,
    width: 480,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nextButton = canvas.getByText("Next");

    const firstElement = await canvas.findByText(
      textContentMatcher(newData[0][0].code)
    );
    const secondElement = await canvas.findByText(
      textContentMatcher(newData[1][0].code)
    );
    const thirdElement = await canvas.findByText(
      textContentMatcher(newData[2][0].code)
    );

    await expect(
      firstElement.closest('[aria-hidden="true"]')
    ).toBeInTheDocument();
    await expect(
      secondElement.closest('[aria-hidden="true"]')
    ).not.toBeInTheDocument();
    await expect(
      thirdElement.closest('[aria-hidden="true"]')
    ).toBeInTheDocument();

    await userEvent.click(nextButton);

    await expect(
      firstElement.closest('[aria-hidden="true"]')
    ).toBeInTheDocument();
    await expect(
      secondElement.closest('[aria-hidden="true"]')
    ).toBeInTheDocument();
    await expect(
      thirdElement.closest('[aria-hidden="true"]')
    ).not.toBeInTheDocument();
  },
};
