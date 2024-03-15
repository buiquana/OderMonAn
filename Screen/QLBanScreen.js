import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View,Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const QLBanScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableList, setTableList] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [key, setKey] = useState(Date.now().toString());

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.106:3000/table');
      const data = await response.json();
      if (response.ok) {
        setTableList(data);
      }else{
        console.error('Failed to fetch table data:', data.error);
      }
    }catch(error){
      console.error('Connection error:', error);
    }
  }

  const handleAddTable = async () => {
    if (!tableNumber) {
      Alert.alert('Thông báo', 'Không được để trống');
      return;
    }
    const isTableExists = tableList.some(item => item.tableNumber === tableNumber);
    if (isTableExists) {
      Alert.alert('Thông báo','Bàn đã tồn tại');
      return;
    };
    const newTable = {
      id: Math.random().toString(), 
      tableNumber: tableNumber,
    };
    try {
      const response = await fetch('http://192.168.0.106:3000/table',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTable),
    });
    const data = await response.json();
    if (response.ok) {
      setTableList((prevTableList) => [...prevTableList,data]);
    }else{
      console.error('Failed to add table:', data.error);
    }
    } catch (error) {
      console.error('Connection error:', error);
    }
    toggleModal();
  };

  const handleDeleteTable = (table) => {
    Alert.alert(
      'Xác Nhận',
      'Bạn có chắc chắn muốn xóa bàn này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => confirmDelete(table),
        },
      ],
      {cancelable:false}
    );
  };

  const  confirmDelete = async (table) => {
    try{
      const response = await fetch(`http://192.168.0.106:3000/table/${table.id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
      },
      });
      const data = await response.json();
      if (response.ok) {
        setTableList((prevTableList) => prevTableList.filter((t) => t.id !== table.id));
      }else{
        console.error('Failed to delete table:', data.error);
      }
    }catch(error){
      console.error('Connection error:', error);
    }
  };

  return ( 
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal} style={{width:'25%',height:30,backgroundColor:'green',top:60,left:156,justifyContent:'center',alignItems:'center',borderRadius:10}}>
        <Text style={{fontSize:20,fontWeight:'bold',color:'#fff'}}>Thêm Bàn</Text>
      </TouchableOpacity>
        <FlatList
          key={key}
          style={{top:100}}
          data={tableList}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          renderItem={({item})=>(
            <View style={styles.tableItem}>
              <Text style={{fontSize:20,left:5}}>{`Bàn ${item.tableNumber}`}</Text>
              <TouchableOpacity onPress={() => handleDeleteTable(item)}>
                <Image source={require('../assets/delete.png')} style={{width:25,height:25,left:85}}/>
              </TouchableOpacity>
              <Image source={require('../assets/table1.png')} style={{width:100,height:100,top:20,right:43}}/>
            </View>
          )} />
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder = "Nhập số bàn"
            onChangeText = {(text) => setTableNumber(text)}
            value = {tableNumber}/>
              <TouchableOpacity style={{backgroundColor:'#fff',width:50,height:30,justifyContent:'center',alignItems:'center',borderRadius:10,right:50,top:5}} onPress={handleAddTable}>
                <Text>Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{backgroundColor:'#fff',width:50,height:30,justifyContent:'center',alignItems:'center',borderRadius:10,left:50,bottom:25}} onPress={toggleModal}>
                <Text>Hủy</Text>
              </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#f498c0',
    flex: 1,

  },
  modalContainer: {
    backgroundColor: 'green',
    padding: 22,
    height:100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    top:100,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    marginTop: 40,
    width: 200,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor:'#fff'
  },
  tableItem: {
    flexDirection: 'row',
    backgroundColor:'#fff',
    width:'40%',
    margin:20,
    height:140,
    borderRadius:15
  },
});

export default QLBanScreen;
