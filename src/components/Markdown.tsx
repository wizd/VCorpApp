import React, {FC} from 'react';
import {View, Text} from 'react-native';
import CodeBlock, {CodeBlockProps} from './CodeBlock';

interface MarkdownProps {
  text: string;
}

const Markdown: FC<MarkdownProps> = ({text}) => {
  const content: JSX.Element[] = [];

  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const language = line.substring(3);
      const codeStartIndex = i + 1;
      let code = '';

      for (i = codeStartIndex; i < lines.length; i++) {
        if (lines[i].startsWith('```')) {
          break;
        }
        code += lines[i] + '\n';
      }

      content.push(
        <CodeBlock
          key={`code-block-${content.length}`}
          language={language}
          code={code}
        />,
      );
    } else {
      content.push(<Text key={`text-${content.length}`}>{line}</Text>);
    }
  }

  return <View>{content}</View>;
};

export default Markdown;
