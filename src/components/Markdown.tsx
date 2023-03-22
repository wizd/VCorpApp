import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Color, FontFamily, FontSize} from '../../GlobalStyles';
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
      content.push(
        <Text
          selectable={true}
          style={styles.helloChatgpthowAre}
          key={`text-${content.length}`}>
          {line}
        </Text>,
      );
    }
  }

  return <View>{content}</View>;
};

const styles = StyleSheet.create({
  helloChatgpthowAre: {
    fontSize: FontSize.size_lg,
    fontWeight: '700',
    fontFamily: FontFamily.nunitoMedium,
    textAlign: 'left',
  },
});

export default Markdown;
