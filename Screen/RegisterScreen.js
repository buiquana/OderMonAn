import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username || !password || !password1) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
  
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(username)) {
      Alert.alert('Thông báo', 'Số điện thoại không hợp lệ');
      return;
    }
    if (password !== password1) {
        Alert.alert('Thông báo','Mật khẩu nhập lại không khớp');
        return;
    }
  
    try {
        // Thực hiện đăng ký
        const registerResponse = await fetch('http://192.168.0.106:3000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
    
        const registerData = await registerResponse.json();
    
        if (registerResponse.ok) {
          Alert.alert('Thông báo','Đăng ký tài khoản thành công');
          navigation.navigate('Login');
        } else {
          console.error('Đăng ký thất bại:', registerData.error);
        }
      } catch (error) {
        console.error('Lỗi kết nối khi đăng ký:', error);
      }
  };
  

  const navigateLogin = () => {
    // Chuyển hướng sang màn hình đăng nhập
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image style={{ width: '100%', height: 350, position: 'absolute', top: 20 }} source={require('../assets/logo.png')} />
      <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'green', top: 120 }}>Register Use</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        onChangeText={(text) => setUsername(text)}
        value={username}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật Khẩu"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        onChangeText={(text) => setPassword1(text)}
        value={password1}
      />
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: 'green', width: '35%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', top: 145 }}>
        <Text style={{ fontSize: 25, color: '#fff', fontWeight: 'bold' }}>Register</Text>
      </TouchableOpacity>
      <Text onPress={navigateLogin} style={{ fontSize: 20, top: 165, color: 'green', fontWeight: 'bold' }}>
        Bạn đã có tài khoản? Đăng nhập ngay
      </Text>
      <TouchableOpacity style={{ backgroundColor: '#fff', width: '60%', height: 50, borderRadius: 15, top: 180 }}>
        <Image style={{ width: 45, height: 45, top: 3 }} source={require('../assets/fb.png')} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', bottom: 33, left: 55 }}>Sign in with FaceBook</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: '#fff', width: '60%', height: 50, borderRadius: 15, top: 200 }}>
        <Image style={{ width: 40, height: 40, top: 5, left: 5 }} source={require('../assets/google.png')} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', bottom: 27, left: 55 }}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: '#fff', width: '60%', height: 50, borderRadius: 15, top: 220 }}>
        <Image style={{ width: 45, height: 45, top: 3 }} source={require('../assets/twitter.png')} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black', bottom: 34, left: 55 }}>Sign in with Twitter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f498c0',
  },
  input: {
    height: 45,
    borderColor: 'green',
    borderWidth: 2,
    marginBottom: 10,
    padding: 10,
    width: '80%',
    top: 135,
  },
});

export default RegisterScreen;
