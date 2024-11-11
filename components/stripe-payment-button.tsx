import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react'
import { Alert, Text } from 'react-native';
import CustomButton from './custom-button';

const StripePaymentButton = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState(false)

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName:"Ryde Inc.",
      intentConfiguration:{
        mode:{
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (!error) {
      setLoading(true);
    }
  };
  const confirmHandler = async (
    paymentMethod,
    shouldSavePaymentMethod,
    intentCreationCallBack,
  ) => {

  };

  const openPaymentSheet = async () => {

    await initializePaymentSheet();

      const { error } = await presentPaymentSheet();
  
      if (error) {
          Alert.alert(`Error code: ${error.code}`,error.message);
      } else {
        setSuccess(true)
      }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);
  return (
    <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
  )
}

export default StripePaymentButton