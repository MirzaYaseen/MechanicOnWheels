import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import port from '../Port/Port';
import React, {useState, useContext, useEffect} from 'react';
import {Font, Commonstyles} from '../font/Font';
import Lottie from 'lottie-react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import CartProvider from '../ContextApi/contextApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomerNotification = () => {
  const {userdetails, setuserdetails, token} = useContext(CartProvider);
  const [array, setarray] = useState([]);
  const [cartmodalVisible, setcartModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [getcondition, setcondition] = React.useState(true);
  const [condition, setCondition] = React.useState(true);
  const [refOfProduct, setrefOfProduct] = React.useState();
  const [userRating, setUserRating] = useState(0);
  const [userReview, setuserReview] = useState('');

  //Get all notifications
  const getproduct = async () => {
    console.log('I am here');
    try {
      const result = await axios.get(
        `${port.herokuPort}/MechanicAfterAcceptingNotification/getNotification/${userdetails._id}`,
      );
      console.log(result.data.data);

      const FilteredNotification = result.data.data.filter(val => {
        if (val.status !== 'Pending') {
          return val;
        }
      });

      setarray(FilteredNotification);

      setcondition(false);
    } catch (err) {
      console.log(err.response.data.message);
      Alert.alert('Error');
    }
  };

  //Delete Notification
  const deleteNotification = async id => {
    try {
      const result = await axios.delete(
        `${port.herokuPort}/MechanicAfterAcceptingNotification/deleteNotification/${id}`,
      );

      Alert.alert('Deleted successfully');
    } catch (err) {
      console.log(err.response.message);
    }
  };

  useEffect(() => {
    getproduct();
  }, [condition]);
  return (
    <View style={{flex: 1}}>
      {/* Model to ask for review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartmodalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setcartModalVisible(!cartmodalVisible);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView3}>
            <View>
              <View
                style={{
                  marginTop: 8,

                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottomWidth: 0.5,
                  borderColor: 'grey',
                  paddingBottom: 25,
                }}>
                <Text style={styles.modalText3}>Rate Product</Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontFamily: 'Lexend-Regular',
                    fontWeight: '400',
                  }}>
                  Tell us how do you fell about Product ;)
                </Text>
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <Pressable onPress={() => setcartModalVisible(false)}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: Font.ButtonColor,
                      marginRight: 15,
                      fontWeight: '600',
                      fontFamily: 'Lexend-Regular',
                    }}>
                    Cancel
                  </Text>
                </Pressable>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setcartModalVisible(false);
                    setModalVisible(true);
                  }}>
                  <MaterialCommunityIcons
                    name="pencil-box"
                    size={30}
                    color={Font.LabelColor}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: 16,
                      color: Font.LabelColor,
                      fontWeight: '600',
                      fontFamily: 'Lexend-Regular',
                    }}>
                    Write a Review
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal to take review */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                marginTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                <Text
                  style={{
                    fontSize: 17,
                    color: Font.ButtonColor,
                    marginLeft: 15,
                    fontWeight: '600',
                    fontFamily: 'Lexend-Regular',
                  }}>
                  Cancel
                </Text>
              </Pressable>
              <Text style={styles.modalText}>Write a Review</Text>
              <TouchableOpacity
                onPress={() => {
                  if (userReview.length === 0 || userRating === 0) {
                    Alert.alert('Review and Rating can not be empty');
                  } else {
                    console.log(userRating);
                    postReview();
                  }
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: Font.ButtonColor,
                    marginRight: 15,
                    fontWeight: '600',
                    fontFamily: 'Lexend-Regular',
                  }}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <AirbnbRating
                showRating={false}
                count={5}
                reviews={['Terrible', 'Bad', 'Normal', 'Good', 'Excellent']}
                defaultRating={0}
                size={20}
                onFinishRating={rating => {
                  setUserRating(rating);
                }}
              />
              <Text
                style={{
                  color: Font.BackGroundColor,
                  textAlign: 'center',
                  fontFamily: 'Lexend-Regular',
                  fontWeight: '400',
                }}>
                Tap a star to rate
              </Text>
            </View>
            <TextInput
              multiline={true}
              placeholder="Write review"
              placeholderTextColor="grey"
              style={{
                margin: 12,
                borderTopWidth: 1,
                padding: 10,
                color: 'white',
              }}
              onChangeText={review => {
                setuserReview(review);
              }}
            />
          </View>
        </View>
      </Modal>
      {getcondition ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Lottie
            style={{
              marginTop: -30,
              width: 360,
              height: 425,
              alignSelf: 'center',
            }}
            source={require('../../assets/loader.json')}
            autoPlay
            loop
          />
          <Text
            style={{
              marginTop: -180,
              fontSize: 16,
              fontWeight: '700',
              marginLeft: 10,
              paddingBottom: 80,
              color: Font.LabelColor,
              fontFamily: 'Lexend-Regular',
            }}>
            Fetching Data for You
          </Text>
        </View>
      ) : Object.keys(array).length === 0 ? (
        <View style={{alignItems: 'center'}}>
          <Lottie
            style={{
              marginTop: -10,
              width: 550,
              height: 510,
              alignSelf: 'center',
            }}
            source={require('../../assets/Not Found.json')}
            autoPlay
            loop
          />
          <Text
            style={{
              marginTop: -90,
              fontSize: 20,
              fontWeight: '700',
              marginLeft: 10,
              color: Font.LabelColor,
              fontFamily: 'Lexend-Regular',
            }}>
            No Notification Yet :(
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
              padding: 13,
              backgroundColor: 'white',
              borderBottomWidth: 0.6,
              borderColor: 'grey',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 15,
                  color: Font.TextBackground,
                  fontFamily: 'Lexend-Regular',
                }}>
                {array.length} Results
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{flexDirection: 'row', marginRight: 15}}>
                <Text style={styles.TextColor}>Sort</Text>
                <MaterialIcons
                  name={'sort'}
                  size={20}
                  color={'black'}
                  style={{marginLeft: 3}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{marginRight: 5, flexDirection: 'row'}}>
                <Text style={styles.TextColor}>Filter</Text>
                <AntDesign
                  name={'filter'}
                  size={20}
                  color={'black'}
                  style={{marginLeft: 3}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{margin: 10}}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontWeight: 'bold',
                fontFamily: 'Lexend-Regular',
              }}>
              History
            </Text>
          </View>

          <View style={{marginBottom: 105, margin: 5}}>
            <FlatList
              data={array}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              renderItem={({item, index}) => {
                return (
                  <View>
                    <View
                      style={{
                        margin: 5,
                        backgroundColor: 'white',
                        borderRadius: 8,
                        flexDirection: 'row',
                        height: 145,
                      }}>
                      <View
                        style={{
                          flex: 1.8,
                          backgroundColor: '#D3D3D3',
                          alignItems: 'center',
                          borderRadius: 8,
                        }}>
                        <Image
                          source={{
                            uri: item.refOfMechanic.photoUrl,
                          }}
                          resizeMode={'cover'}
                          style={{
                            width: '100%',
                            height: 138,
                            borderRadius: 10,
                            margin: 4,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 4,
                          margin: 5,
                        }}>
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text
                              style={{
                                marginLeft: 3,
                                color: 'grey',
                                fontFamily: 'Lexend-Regular',
                                fontWeight: '400',
                              }}>
                              Name: {item.refOfCustomer.firstname}{' '}
                              {item.refOfCustomer.lastname}
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setCondition(!condition);
                                deleteNotification(item._id);
                              }}>
                              <Text
                                style={{
                                  color: 'red',
                                  fontFamily: 'Lexend-Regular',
                                  fontWeight: '400',
                                }}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text
                            style={{
                              marginLeft: 3,
                              fontSize: 16,
                              fontWeight: '700',
                              color: Font.TextBackground,
                              fontFamily: 'Lexend-Regular',
                            }}>
                            PAID {item.price}
                          </Text>
                          <Text
                            style={{
                              marginLeft: 3,
                              color: 'grey',
                              fontFamily: 'Lexend-Regular',
                              fontWeight: '400',
                            }}>
                            Work: {item.Description}
                          </Text>

                          <Text
                            style={{
                              marginLeft: 3,
                              color: 'grey',
                              fontFamily: 'Lexend-Regular',
                              fontWeight: '400',
                            }}>
                            Payment Method:{' '}
                            <Text style={{color: Font.LabelColor}}>
                              Cash on delivery
                            </Text>
                          </Text>
                          <View
                            style={{
                              alignItems: 'flex-start',
                              marginLeft: 3,
                            }}>
                            <Text
                              style={{
                                marginLeft: 3,
                                color: 'grey',
                                fontFamily: 'Lexend-Regular',
                                fontWeight: '400',
                              }}>
                              Status:{' '}
                              <Text
                                style={
                                  item.status === 'Reached'
                                    ? {
                                        color: '#FFBF00',
                                        fontWeight: 'bold',
                                        fontFamily: 'Lexend-Regular',
                                        fontWeight: '400',
                                      }
                                    : {
                                        color: 'green',
                                        fontWeight: 'bold',
                                        fontFamily: 'Lexend-Regular',
                                        fontWeight: '400',
                                      }
                                }>
                                {item.status}
                              </Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CustomerNotification;

const styles = StyleSheet.create({
  centeredView2: {
    alignItems: 'center',
  },
  centeredView: {},

  modalView: {
    marginTop: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 15,
    height: '100%',
    width: '100%',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView3: {
    marginTop: '50%',
    marginBottom: 10,
    backgroundColor: Font.BackGroundColor,
    borderRadius: 15,
    height: '34%',
    width: '80%',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
  },
  modalText3: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
  TextColor: {
    color: Font.TextBackground,
    fontFamily: 'Lexend-Regular',
    fontWeight: '400',
  },
});
