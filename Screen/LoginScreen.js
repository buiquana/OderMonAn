import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View,Alert } from 'react-native'
import React , { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
            return;
          }
        try {
            const response = await fetch('http://192.168.0.106:3000/user');
            const userData = await response.json();
            if (response.ok) {
                const userFound = userData.find(user => user.username === username && user.password === password);
                if (userFound) {
                    navigation.navigate('Home');
                }else{
                    Alert.alert('Thông báo', 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
                }
            }else{
                console.error('Lỗi kết nối:', response.status);
                Alert.alert('Thông báo', 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
            Alert.alert('Thông báo', 'Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    }

    const navigateToRegister = () => {
        // Chuyển hướng sang màn hình đăng ký
        navigation.navigate('Register');
      };
    
  return (
    <View style={styles.container}>
        <Image style={{width:'100%',height:350,position:'absolute',top:40}} source={require('../assets/logo.png')}/>
      <Text style={{fontSize:35,fontWeight:'bold',color:'green',top:130}}>Login Use</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        onChangeText={(text) => setUsername(text)}
        value={username}/>
        <TextInput
         style={styles.input}
         placeholder="Mật Khẩu"
         secureTextEntry
         onChangeText={(text) => setPassword(text)}
         value={password}/>
         <TouchableOpacity onPress={handleLogin} style={{backgroundColor:'green',width:'35%',height:50,borderRadius:10,justifyContent:'center',alignItems:'center',top:165}}>
            <Text style={{fontSize:25,color:'#fff',fontWeight:'bold'}}>Login</Text>
         </TouchableOpacity>
         <Text onPress={navigateToRegister} style={{fontSize:20,top:185,color:'green',fontWeight:'bold'}}>Bạn chưa có tài khoản? Đăng ký ngay</Text>
         <TouchableOpacity style={{backgroundColor:'#fff',width:'60%',height:50,borderRadius:15,top:200}}>
            <Image style={{width:45,height:45,top:3}} source={require('../assets/fb.png')}/>
            <Text style={{fontSize:18,fontWeight:'bold',color:'black',bottom:33,left:55}}>Sign in with FaceBook</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{backgroundColor:'#fff',width:'60%',height:50,borderRadius:15,top:220}}>
            <Image style={{width:40,height:40,top:5,left:5}} source={require('../assets/google.png')}/>
            <Text style={{fontSize:18,fontWeight:'bold',color:'black',bottom:27,left:55}}>Sign in with Google</Text>
         </TouchableOpacity>
         <TouchableOpacity style={{backgroundColor:'#fff',width:'60%',height:50,borderRadius:15,top:240}}>
            <Image style={{width:45,height:45,top:3}} source={require('../assets/twitter.png')}/>
            <Text style={{fontSize:18,fontWeight:'bold',color:'black',bottom:34,left:55}}>Sign in with Twitter</Text>
         </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#f498c0'
      },
      input: {
        height: 45,
        borderColor: 'green',
        borderWidth: 2,
        marginBottom: 10,
        padding: 10,
        width: '80%',
        top:150
      },
});

export default LoginScreen;
