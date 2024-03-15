import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react';

const QLMonAnScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalSua, setModalSua] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputURL, setInputURL] = useState('');
  const [tenMonAn, setTenMonAn] = useState('');
  const [gia, setGia] = useState('');
  const [monAnList, setMonAnList] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [key, setKey] = useState(Date.now().toString());

  useEffect(() => {
    fetchData();
  }, []);

  const toggleModal = () => {    
    setModalVisible(!isModalVisible);
  };

  const editModal = (product) => {
    setSelectedProduct(product);
    setModalSua(!modalSua);
  }

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.106:3000/monan');
      const data = await response.json();
      if (response.ok) {
        setMonAnList(data);
      } else {
        console.error('Failed to fetch data:', data.error);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleAddMonAn = async () => {
    if (inputURL && tenMonAn && gia) {
      const newMonAn = {
        id: Math.random().toString(), 
        imageURL: inputURL,
        tenMonAn: tenMonAn,
        gia: gia,
      };
      try {
        const response = await fetch('http://192.168.0.106:3000/monan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMonAn),
        });
        const data = await response.json();
        if (response.ok) {
          setMonAnList([...monAnList, data]);
          toggleModal();
          setInputURL('');
          setTenMonAn('');
          setGia('');
        } else {
          console.error('Failed to add mon an:', data.error);
        }
      } catch (error) {
        console.error('Connection error:', error);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin món ăn.');
    }
  };

  const handleDelteteMonAn = (monAn) => {
    Alert.alert(
      'Xác Nhận',
      'Bạn có chắc chắn muốn xóa món ăn này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => confirmDelete(monAn),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDelete = async (monAn) => {
    try {
      const response = await fetch(`http://192.168.0.106:3000/monan/${monAn.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMonAnList((prevMonAnList) => prevMonAnList.filter((eat) => eat.id !== monAn.id));
      } else {
        console.error('Failed to delete table:', data.error);
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleEditMonAn = async () => {
    if (selectedProduct && (tenMonAn || gia)) {
      const updatedMonAn = {
        id: selectedProduct.id,
        imageURL: selectedProduct.imageURL,
        tenMonAn: tenMonAn || selectedProduct.tenMonAn,
        gia: gia || selectedProduct.gia,
      };
      try {
        const response = await fetch(`http://192.168.0.106:3000/monan/${selectedProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedMonAn),
        });
        const data = await response.json();
        if (response.ok) {
          setMonAnList(monAnList.map(item => item.id === selectedProduct.id ? updatedMonAn : item));
          setTenMonAn('');
          setGia('');
          editModal();
        } else {
          console.error('Failed to edit mon an:', data.error);
        }
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal} style={{ width: '35%', height: 30, backgroundColor: 'green', top: 60, left: 130, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Thêm Món Ăn</Text>
      </TouchableOpacity>
      <FlatList
        key={key}
        style={{ top: 100 }}
        data={monAnList}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={styles.monAnItem}>
            <TouchableOpacity onPress={() => handleDelteteMonAn(item)}>
              <Image source={require('../assets/delete.png')} style={{ width: 21, height: 21, left: 140, top: 4 }} />
            </TouchableOpacity>
            <Image source={{ uri: item.imageURL }} style={{ width: '75%', height: 100, top: 20, right: 6 }} />
            <View style={{ position: 'absolute', bottom: 0, left: 0, width: '75%', padding: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green', width: 183 }}>{item.tenMonAn}</Text>
              <Text style={{ fontSize: 15, color: 'gray', fontWeight: 'bold' }}>{item.gia} đ</Text>
            </View>
            <TouchableOpacity onPress={() => editModal(item)}>
              <Image source={require('../assets/edit.png')} style={{ right: 5, width: 21, height: 21, top: 140}} />
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder='Nhập URL hình ảnh'
            onChangeText={(text) => setInputURL(text)}
            value={inputURL} />
          <TextInput
            style={styles.input}
            placeholder='Nhập tên món ăn'
            onChangeText={(text) => setTenMonAn(text)}
            value={tenMonAn} />
          <TextInput
            style={styles.input}
            placeholder='Nhập Giá'
            onChangeText={(text) => setGia(text)}
            value={gia} />
          <TouchableOpacity style={{ backgroundColor: '#fff', width: 50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10, right: 50, top: 5 }} onPress={handleAddMonAn}>
            <Text>Thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#fff', width: 50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10, left: 50, bottom: 25 }} onPress={toggleModal}>
            <Text>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal transparent={true} visible={modalSua} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder={selectedProduct ? selectedProduct.tenMonAn : "Tên món ăn"}
            onChangeText={(text) => setTenMonAn(text)}
            value={tenMonAn} />
          <TextInput
            style={styles.input}
            placeholder={selectedProduct ? selectedProduct.gia : "Giá"}
            onChangeText={(text) => setGia(text)}
            value={gia} />
          <TouchableOpacity style={{ backgroundColor: '#fff', width: 50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10, right: 50, top: 5 }} onPress={handleEditMonAn}>
            <Text>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#fff', width: 50, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 10, left: 50, bottom: 25 }} onPress={editModal}>
            <Text>Hủy</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f498c0'
  },
  modalContainer: {
    backgroundColor: 'green',
    padding: 22,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    top: 100,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    marginTop: 40,
    width: 300,
    fontWeight: 'bold',
  },
  monAnItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '40%',
    margin: 20,
    height: 170,
    borderRadius: 15
  },
});

export default QLMonAnScreen;
