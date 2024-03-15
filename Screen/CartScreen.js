import { FlatList, StyleSheet, Text, View,TouchableOpacity,Image,Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [tableNumber, setTableNumber] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        fetchData();
      }, []);

      useEffect(() => {
        calculateTotalPrice();
    }, [products]);

      const fetchData = async () => {
        try {
          const response = await fetch('http://192.168.0.106:3000/cart');
          const data = await response.json();
          if (response.ok) {
            setProducts(data);
          } else {
            console.error('Failed to fetch data:', data.error);
          }
        } catch (error) {
          console.error('Connection error:', error);
        }
      };

    const handleCallOrder = () => {
      Alert.alert(
        'Thông báo',
        'Quý khách đã gọi món thành công. Xin vui lòng chờ trong giây lát.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    };

    const renderItem = ({item}) => (
        <View style={styles.item}>
            <Text style={styles.itemName}>{item.tenMonAn}</Text>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:16,fontWeight:'bold',marginLeft:5,color:'gray',marginRight:145}}>SL {item.quantity}</Text>
            <Text style={styles.itemGia}>{(parseFloat(item.gia.replace(' đ', '').replace('.', '')) * item.quantity).toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>
    );

    const calculateTotalPrice = () => {
      let totalPrice = 0;
      products.forEach(product => {
        const price = parseFloat(product.gia.replace(' đ', '').replace('.', ''));
        const totalPriceForItem = price * product.quantity;
        totalPrice += totalPriceForItem;
      });
      setTotalPrice(totalPrice.toLocaleString('vi-VN'));
    };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/back.png')} style={{ width: 30, height: 30,right:8 }} />
            <Text style={{fontSize:20,fontWeight:'bold',bottom:30,left:20}}>Trở lại</Text>
        </TouchableOpacity>
        <View style={styles.listContainer}>
            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                style={styles.flatList}
              />
            </View>
        <View>
          <Text style={styles.totalPrice}>Tổng Tiền: {totalPrice} đ</Text>
        </View>
        <TouchableOpacity onPress={handleCallOrder} style={{width:'90%',backgroundColor:'green',height:50,justifyContent:'center',alignItems:'center',borderRadius:20,margin:26}}>
          <Text style={{fontSize:24,color:'#fff',fontWeight:'bold'}}>Gọi Món</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
      },
      listContainer: {
        height: '50%', 
        marginBottom: 50, 
    },
    flatList: {
        flexGrow: 0,
        top:100,
        backgroundColor:'#f498c0' 
    },
      item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
      itemName: {
        fontSize: 16,
        fontWeight: 'bold',

      },
      itemGia: {
        fontSize: 16,
        right:10
      },
      totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        top:10,
        color:'green',
        marginTop: 15,
      },
      backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
    }
});

export default CartScreen;