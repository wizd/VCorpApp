import React from 'react';
import {View} from 'react-native';
import AIMessage from '../AIMessage';
import UserMessage from '../UserMessage';
import {CheckBox} from '@rneui/themed';

const MessageItem = ({
  item,
  index,
  isShareMode,
  handleStop,
  handleShare,
  handleSelectMessage,
}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {isShareMode && (
        <CheckBox
          checked={item.isSelected}
          onPress={() => handleSelectMessage(item)}
        />
      )}
      {item.isAI ? (
        <AIMessage
          key={index}
          text={item.text}
          isLoading={item.isLoading}
          msg={item}
          onStop={handleStop}
          handleShare={handleShare}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <UserMessage
            key={index}
            text={item.text}
            isLoading={item.isLoading}
          />
        </View>
      )}
    </View>
  );
};

export default MessageItem;
