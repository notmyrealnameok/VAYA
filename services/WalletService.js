import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the import path as necessary

// Create a new wallet document for a user
export const createWallet = async (userId) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    await setDoc(walletRef, { balance: 0 });
    console.log('Wallet created successfully');
  } catch (error) {
    console.error('Error creating wallet: ', error);
    throw error;
  }
};

// Fetch the wallet balance for a user
export const fetchWalletBalance = async (userId) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);

    if (walletSnap.exists()) {
      return walletSnap.data().balance;
    } else {
      console.error('Wallet does not exist');
      throw new Error('Wallet does not exist');
    }
  } catch (error) {
    console.error('Error fetching wallet balance: ', error);
    throw error;
  }
};

// Update the wallet balance based on transaction type
export const updateWalletBalance = async (userId, amount, transactionType) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnap = await getDoc(walletRef);

    if (walletSnap.exists()) {
      let newBalance = walletSnap.data().balance;

      if (transactionType === 'deposit') {
        newBalance += amount;
      } else if (transactionType === 'withdraw') {
        if (newBalance >= amount) {
          newBalance -= amount;
        } else {
          console.error('Insufficient balance');
          throw new Error('Insufficient balance');
        }
      } else {
        console.error('Invalid transaction type');
        throw new Error('Invalid transaction type');
      }

      await setDoc(walletRef, { balance: newBalance }, { merge: true });
      return newBalance;
    } else {
      console.error('Wallet does not exist');
      throw new Error('Wallet does not exist');
    }
  } catch (error) {
    console.error('Error updating wallet balance: ', error);
    throw error;
  }
};
