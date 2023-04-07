import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Color, FontFamily, FontSize} from '../../GlobalStyles';
import CodeBlock, {CodeBlockProps} from './CodeBlock';
import HyperText from './tools/ClickableLinks';
import ClickableLinks from './tools/ClickableLinks';

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
      content.push(
        <ClickableLinks key={`clickable-links-${i}`} content={line} />,
      );
    }
  }

  return <View>{content}</View>;
};

// selectable={true}
// style={styles.helloChatgpthowAre}
// key={`text-${content.length}`}>
//const styles = StyleSheet.create({});

export default Markdown;
