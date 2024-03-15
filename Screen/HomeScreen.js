import { Image, StyleSheet, Text, View,FlatList,Alert,TextInput,TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import QLBanScreen from '../Screen/QLBanScreen';
import QLMonAnScreen from '../Screen/QLMonAnScreen';
import SettingScreen from '../Screen/SettingScreen';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator>
    <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('../assets/home1.png') : require('../assets/home1.png')}
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? require('../assets/table1.png') : require('../assets/table1.png')}
            style={{ width: 25, height: 25 }}
          />
        ),
      }}
      name="QLBan"
      component={QLBanScreen}
      />
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? require('../assets/eatt.png') : require('../assets/eatt.png')}
            style={{ width: 25, height: 25 }}
          />
        ),
      }}
      name="QLMonAn"
      component={QLMonAnScreen}
      />
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Image
            source={focused ? require('../assets/setting.png') : require('../assets/setting.png')}
            style={{ width: 25, height: 25 }}
          />
        ),
      }}
      name="Setting"
      component={SettingScreen}
      />
  </Tab.Navigator>
  )
}

const Home = () => {
  const [tableList, setTableList] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [key, setKey] = useState(Date.now().toString());
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const navigation = useNavigation();

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

  const handleToggleCheck = (itemId) => {
    setTableList((prevTableList) => {
      const updatedTableList = prevTableList.map((table) => {
        if (table.id === itemId) {
          return { ...table, checked: !table.checked };
        }
        return table;
      });
      return updatedTableList;
    });
  };

  const handleChonMon = () => {
    const isAny = tableList.some((table) => table.checked);
    if (isAny) {
      navigation.navigate("Menu");
    }else{
      Alert.alert('Thông báo', 'Quý khách chưa chọn bàn.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.t}>- Quý khách vui lòng chọn bàn -</Text>
      <FlatList
          key={key}
          style={{top:100}}
          data={tableList}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          renderItem={({item,index})=>(
            <View style={styles.tableItem}>
              <View style={{height:30}}>
              <Text style={{fontSize:20,left:5}}>{`Bàn ${item.tableNumber}`}</Text>
              </View>
              <TouchableOpacity onPress={() => handleToggleCheck(item.id)}>
              <Image source={item.checked ? require('../assets/check.png') : require('../assets/nocheck.png')} style={{width: 25, height: 25, left: 75}} />
              </TouchableOpacity>
              <Image source={require('../assets/table1.png')} style={{width:100,height:95,top:31,right:43}}/>
            </View>
          )} />
          <TouchableOpacity onPress={handleChonMon} style={{backgroundColor:'green',height:50,justifyContent:'center',alignItems:'center',margin:10,borderRadius:15}}>
            <Text style={{fontSize:20,fontWeight:'bold',color:'#fff'}}>Chọn Món</Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#f498c0',
    flex:1
  },
  t:{
    fontSize:25,
    fontWeight:'bold',
    color:'green',
    left:22,
    top:55
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

export default HomeScreen;