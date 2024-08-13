import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ScrollView, SafeAreaView, Alert, Animated, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { COLORS } from '../constants/colors';
import { db, doc, getDoc, setDoc } from '../firebase'; // Adjust import path as needed
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

export default function PaymentForm({ navigation }) {
  const cardholderNameRef = useRef(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the current user ID
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchWalletBalance = async () => {
        try {
          const docRef = doc(db, 'wallets', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setWalletBalance(docSnap.data().balance || 0);
          }
        } catch (error) {
          console.error('Error fetching wallet balance: ', error);
        }
      };

      fetchWalletBalance();
    }
  }, [userId]);

  const depositButtonColor = useRef(new Animated.Value(0)).current;
  const withdrawButtonColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(depositButtonColor, {
      toValue: transactionType === 'deposit' ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    Animated.timing(withdrawButtonColor, {
      toValue: transactionType === 'withdraw' ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [transactionType]);

  const handleEnableFields = (type) => {
    setTransactionType(type);
    cardholderNameRef.current?.focus();
  };

  const validateCardNumber = (number) => {
    return /^(\d{4} \d{4} \d{4} \d{4})$/.test(number);
  };

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    return (
      /^([0-9]{2})\/([0-9]{2})$/.test(date) &&
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= new Date().getFullYear() % 100
    );
  };

  const validateCvv = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const handleTransaction = async () => {
    if (!userId) {
      showAlert('Error', 'User not authenticated.');
      return;
    }

    const transactionAmount = parseFloat(amount);
    if (!isNaN(transactionAmount) && transactionAmount > 0) {
      if (!validateCardNumber(cardNumber)) {
        showAlert('Invalid Card Number', 'Please enter a valid card number in the format: 1234 5678 9012 3456');
        return;
      }
      if (!validateExpiryDate(expiryDate)) {
        showAlert('Invalid Expiry Date', 'Please enter a valid expiry date in the format: MM/YY');
        return;
      }
      if (!validateCvv(cvv)) {
        showAlert('Invalid CVV', 'Please enter a valid CVV (3 digits).');
        return;
      }

      let newBalance = walletBalance;
      if (transactionType === 'deposit') {
        newBalance += transactionAmount;
      } else if (transactionType === 'withdraw' && transactionAmount <= walletBalance) {
        newBalance -= transactionAmount;
      } else {
        showAlert('Insufficient Balance', 'You do not have enough balance for this transaction.');
        return;
      }

      try {
        // Update wallet balance in Firestore
        const docRef = doc(db, 'wallets', userId);
        await setDoc(docRef, { balance: newBalance }, { merge: true });

        // Reset form fields and update local state
        setWalletBalance(newBalance);
        setAmount('');
        setTransactionType(null);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardholderName('');

        // Show success alert
        showAlert('Success', `Transaction successful. Your new balance is R ${newBalance.toFixed(2)}`);
      } catch (error) {
        console.error('Error updating wallet balance: ', error);
        showAlert('Error', 'There was a problem processing your transaction.');
      }
    } else {
      showAlert('Invalid Amount', 'Please enter a valid amount.');
    }
  };

  const depositButtonColorInterpolated = depositButtonColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.lightRed, COLORS.red],
  });

  const withdrawButtonColorInterpolated = withdrawButtonColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.lightRed, COLORS.red],
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.walletContainer}>
            <View style={styles.walletCard}>
              <Text style={styles.walletTitle}>Vaya Bucks</Text>
              <Text style={styles.walletAmount}>R {walletBalance.toFixed(2)}</Text>
              <Text style={styles.walletSubtitle}>Auto-refill is off</Text>
              <View style={styles.buttonContainer}>
                <Animated.View
                  style={[
                    styles.addFundsButton,
                    { backgroundColor: depositButtonColorInterpolated }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleEnableFields('deposit')}
                  >
                    <Text style={styles.buttonText}>Deposit</Text>
                  </TouchableOpacity>
                </Animated.View>
                <Animated.View
                  style={[
                    styles.withdrawButton,
                    { backgroundColor: withdrawButtonColorInterpolated }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleEnableFields('withdraw')}
                  >
                    <Text style={styles.buttonText}>Withdraw</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </View>

          <View style={styles.paymentLogos}>
            <Image source={{ uri: 'https://logo.clearbit.com/visa.com' }} style={styles.logo} />
            <Image source={{ uri: 'https://logo.clearbit.com/mastercard.com' }} style={styles.logo} />
            <Image source={{ uri: 'https://logo.clearbit.com/americanexpress.com' }} style={styles.logo} />
            <Image source={{ uri: 'https://logo.clearbit.com/discover.com' }} style={styles.logo} />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name of Cardholder</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              ref={cardholderNameRef}
              placeholderTextColor={COLORS.grey}
              value={cardholderName}
              onChangeText={setCardholderName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              placeholderTextColor={COLORS.grey}
              value={cardNumber}
              onChangeText={(text) => {
                const cleanedText = text.replace(/\D/g, '');
                const formattedText = cleanedText
                  .slice(0, 16)
                  .replace(/(.{4})/g, '$1 ')
                  .trim();
                setCardNumber(formattedText);
              }}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                keyboardType="numeric"
                placeholderTextColor={COLORS.grey}
                value={expiryDate}
                onChangeText={(text) => {
                  let cleanedText = text.replace(/[^0-9]/g, '');

                  if (cleanedText.length >= 2) {
                    cleanedText = cleanedText.slice(0, 2) + '/' + cleanedText.slice(2);
                  }

                  cleanedText = cleanedText.slice(0, 5);

                  setExpiryDate(cleanedText);
                }}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="numeric"
                placeholderTextColor={COLORS.grey}
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={COLORS.grey}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.payButton, !transactionType && styles.disabledButton]}
            disabled={!transactionType}
            onPress={handleTransaction}
          >
            <Text style={styles.payButtonText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  walletContainer: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
  },
  walletCard: {
    width: '100%',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginVertical: 10,
  },
  walletSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  addFundsButton: {
    backgroundColor: '#FF6F6F', // Default color
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  withdrawButton: {
    backgroundColor: '#FF6F6F', // Default color
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
  },
  paymentLogos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    color: COLORS.black,
  },
  payButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: -7,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});