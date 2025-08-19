import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import theme from '../theme';
import { chatWithGemini } from '../utils/gemini';

const SUGGESTIONS = [
  'Nên ăn gì?',
  'Gợi ý món trưa',
  'Gợi ý món tối',
  'Món healthy',
  'Món nhiều người thích',
  'Món đặc sản',
  'Có món chay không?',
  'Món ăn nhanh',
  'Món rẻ nhất',
  'Món bán chạy',
];

const GeminiChat = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Xin chào! Tôi là trợ lý AI món ăn. Hãy hỏi tôi "nên ăn gì" hoặc chọn gợi ý bên dưới nhé!',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);

  const restaurants = useSelector((state) => state.restaurants.items);
  const allFoods = restaurants.flatMap((r) =>
    (r.menu || []).map((food) => ({
      ...food,
      restaurant: r.name,
    }))
  );

  const buildPrompt = (userInput) => {
    const foodList = allFoods
      .slice(0, 30)
      .map(
        (food) =>
          `- ${food.name} (${food.restaurant}): ${food.description} - ${
            food.price ? food.price + '$' : ''
          }`
      )
      .join('\n');

    return `Danh sách món ăn trong app:\n${foodList}\nNgười dùng hỏi: ${userInput}\nNếu người dùng hỏi gợi ý món ăn, hãy dựa vào danh sách trên, trả lời thân thiện bằng tiếng Việt.`;
  };

  const handleSend = async (customInput) => {
    const text = typeof customInput === 'string' ? customInput : input;
    if (!text.trim()) return;
    setInput('');
    setMessages((prev) => [...prev, { from: 'you', text }]);
    setLoading(true);
    try {
      const prompt = buildPrompt(text);
      const botReply = await chatWithGemini(prompt);
      setMessages((prev) => [...prev, { from: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Xin lỗi, tôi không thể trả lời lúc này.' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.blue,
            paddingTop: 36,
            paddingBottom: 16,
            paddingHorizontal: 16,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ marginRight: 12 }}>
            <Ionicons name="close" size={28} color={theme.colors.white} />
          </TouchableOpacity>
          <Ionicons name="chatbubbles" size={26} color={theme.colors.white} style={{ marginRight: 8 }} />
          <Text
            style={{
              color: theme.colors.white,
              fontSize: 20,
              fontFamily: theme.fonts.type.bold,
              flex: 1,
            }}
          >
            Trợ lý món ăn AI
          </Text>
        </View>

        {/* Chat body */}
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 6,
                alignSelf: item.from === 'you' ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === 'you' ? theme.colors.primary : theme.colors.secondary,
                padding: 12,
                borderRadius: 18,
                borderBottomRightRadius: item.from === 'you' ? 4 : 18,
                borderBottomLeftRadius: item.from === 'you' ? 18 : 4,
                maxWidth: '80%',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  color: theme.colors.black,
                  fontSize: 15,
                  fontFamily: theme.fonts.type.medium,
                }}
              >
                {item.text}
              </Text>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginVertical: 6,
                  backgroundColor: theme.colors.secondary,
                  padding: 12,
                  borderRadius: 18,
                }}
              >
                <Text style={{ color: theme.colors.gray }}>Đang trả lời...</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        />

        {/* Suggestions */}
        <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
          <FlatList
            data={SUGGESTIONS}
            horizontal
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginRight: 8,
                  marginBottom: 4,
                }}
                onPress={() => handleSend(item)}
                disabled={loading}
              >
                <Text style={{ color: theme.colors.black, fontFamily: theme.fonts.type.medium }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.white,
            borderTopWidth: 1,
            borderColor: theme.colors.gray,
            padding: 10,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi về món ăn, ví dụ: Nên ăn gì?"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.colors.gray,
              borderRadius: 24,
              paddingHorizontal: 18,
              paddingVertical: 10,
              backgroundColor: theme.colors.whiteVariant,
              fontFamily: theme.fonts.type.regular,
              fontSize: 15,
            }}
            editable={!loading}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            style={{ marginLeft: 8 }}
            disabled={loading || !input.trim()}
          >
            <MaterialIcons
              name="send"
              size={28}
              color={input.trim() ? theme.colors.blue : theme.colors.gray}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GeminiChat;
