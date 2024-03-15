import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const [monAnList, setMonAnList] = useState([]);
  const [defaultMonAnList, setDefaultMonAnList] = useState([]);
  const [filteredMonAnList, setFilteredMonAnList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
    fetchCartItemCount();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.106:3000/monan');
      const data = await response.json();
      if (response.ok) {
        setMonAnList(data);
        setDefaultMonAnList(data); // Lưu trữ danh sách mặc định
      } else {
        console.error('Failed to fetch data:', data.error);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const fetchCartItemCount = async () => {
    try {
      const response = await fetch('http://192.168.0.106:3000/cart');
      const data = await response.json();
      if (response.ok) {
        setCartItemCount(data.length);
      }else{
        console.error('Failed to fetch cart items:', data.error);
      }
    } catch (error) {
        console.error('Connection error:', error);
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = defaultMonAnList.filter(item => item.tenMonAn.toLowerCase().includes(query.toLowerCase()));
    if (filteredData.length > 0) {
      setFilteredMonAnList(filteredData); 
      setIsSearching(true); 
    } else {
      setFilteredMonAnList(defaultMonAnList); 
      setIsSearching(false); 
    }
  };

  const addCart = async (item) => {
    try {
        const response = await fetch('http://192.168.0.106:3000/cart');
        const cartItems = await response.json();
        if (!response.ok) {
            console.error('Failed to fetch cart items:', cartItems.error);
            return;
        }

        const existingCartItem = cartItems.find(cartItem => cartItem.id === item.id);
        if (existingCartItem) {
            const updatedCartItem = { ...existingCartItem, quantity: existingCartItem.quantity + 1 };
            const response = await fetch(`http://192.168.0.106:3000/cart/${existingCartItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCartItem)
            });
            if (response.ok) {
                console.log('Món ăn đã tồn tại trong giỏ hàng, đã cập nhật số lượng thành công!');
                fetchCartItemCount();
            } else {
                console.error('Failed to update cart item:', response.error);
            }
        } else {
            const response = await fetch('http://192.168.0.106:3000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...item, quantity: 1 })
            });
            if (response.ok) {
                console.log('Thêm vào giỏ hàng thành công!');
                fetchCartItemCount();
            } else {
                console.error('Failed to add to cart:', response.error);
            }
        }
    } catch (error) {
        console.error('Connection error:', error);
    }
};


  const renderMonAnItem = (item) => (
    <View key={item._id} style={styles.monAnItem}>
      <Image source={{ uri: item.imageURL }} style={{ width: '75%', height: 100, top: 15, left: 20 }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: '75%', padding: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green', width: 183 }}>{item.tenMonAn}</Text>
        <Text style={{ fontSize: 15, color: 'gray', fontWeight: 'bold' }}>{item.gia} đ</Text>
      </View>
      <TouchableOpacity onPress={() => addCart(item)}>
        <Image source={require('../assets/add.png')} style={{ left: 15, width: 25, height: 25, top: 140 }} />
      </TouchableOpacity>
    </View>
  );

  const renderMonAnRows = () => {
    const dataList = isSearching ? filteredMonAnList : monAnList;
    const rows = [];
    for (let i = 0; i < dataList.length; i += 2) {
      rows.push(
        <View key={i} style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            {dataList[i] && renderMonAnItem(dataList[i])}
          </View>
          <View style={{ flex: 1 }}>
            {dataList[i + 1] && renderMonAnItem(dataList[i + 1])}
          </View>
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{top:75,width:45,height:40,left:350}} onPress={() => navigation.navigate('Cart')}>
        <Image source={require('../assets/cartt.png')} style={{bottom:5,width:40,height:40}}/>
        {cartItemCount > 0 && (
          <View style={styles.cartItemCountContainer}>
            <Text style={styles.cartItemCount}>{cartItemCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder='Tìm kiếm món ăn...'
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <ScrollView style={{ flex: 1, top: 55 }}>
        {renderMonAnRows()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f498c0',
    paddingHorizontal: 10,
  },
  monAnItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '80%',
    margin: 20,
    height: 170,
    borderRadius: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 5,
    width:'86%',
    top: 30,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Cho phép các phần tử con xuống dòng khi không còn không gian
    justifyContent: 'space-between',
  },
  cartItemCountContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCount: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MenuScreen;
