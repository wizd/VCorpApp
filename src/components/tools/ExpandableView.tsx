import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  LayoutChangeEvent,
  ViewStyle,
  StyleProp,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const {width} = Dimensions.get('window');

interface ExpandableViewProps {
  children: React.ReactNode;
  expanded?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ExpandableView: React.FC<ExpandableViewProps> = ({
  children,
  expanded,
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(100);
  const [expandedHeight, setExpandedHeight] = useState(100);

  const contentRef = useRef<View>(null);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const {height} = event.nativeEvent.layout;
      if (isExpanded) {
        //setExpandedHeight(height);
      } else {
        //setCollapsedHeight(height);
      }
    },
    [isExpanded],
  );

  const height = isExpanded
    ? collapsedHeight + expandedHeight
    : collapsedHeight;

  //
  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
      <View
        style={[styles.container, style]}
        onLayout={onLayout}
        ref={contentRef}>
        <TouchableOpacity
          style={styles.indicatorContainer}
          onPress={toggleExpansion}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d={isExpanded ? 'M12 15l5-5H7l5 5z' : 'M12 9l5 5H7l5-5z'}
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
        {isExpanded && expanded && (
          <View style={styles.contentup}>{expanded}</View>
        )}
        <View style={styles.content}>{children}</View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  kav: {position: 'absolute', left: 0, right: 0, bottom: 0},
  container: {
    width: '100%',
    position: 'absolute',
    paddingTop: 8,
    left: 0,
    right: 0,
    bottom: 8,
    alignContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    width: 24,
    height: 24,
    alignSelf: 'center',
    position: 'absolute',
    top: -15,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    display: 'none',
  },
  contentup: {
    width: '100%',
  },
  content: {
    flex: 1,
    bottom: 4,
    justifyContent: 'center',
  },
});

export default ExpandableView;
