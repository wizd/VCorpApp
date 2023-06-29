import React, {FC} from 'react';
import {View} from 'react-native';
import CodeBlock from './CodeBlock';
import ClickableLinks from './tools/ClickableLinks';
import MarkdownImage from './MarkdownImage'; // 导入自定义的 MarkdownImage 组件

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
    } else if (/!\[.*\]\(.*\)/.test(line)) {
      // 检查是否是 Markdown 格式的图片链接
      const altText = line.match(/!\[(.*?)\]/)?.[1] || '';
      const imageUrl = line.match(/\((.*?)\)/)?.[1] || '';

      content.push(
        <MarkdownImage
          key={`markdown-image-${content.length}`}
          alt={altText}
          source={imageUrl}
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

export default Markdown;
