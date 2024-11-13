import { PaymentSheetError, useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react'
import { Alert, Text } from 'react-native';
import CustomButton from './custom-button';
import { fetchAPI } from '@/actions/fetch';
import { PaymentProps } from '@/types';

const StripePaymentButton = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}:PaymentProps
) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    _,
    intentCreationCallBack,
  ) => {
    const { paymentIntent, customer} = await fetchAPI('/(api)/(stripe)/create',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName || email.split("@")[0],
        email:email,
        amount:amount,
        paymentMethodId:paymentMethod.id
      }),
    });
    if(paymentIntent.client_secret)
    {
      const { result } = await fetchAPI('/(api)/(stripe)/pay',{
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customer.id,
        }),
    });

    if(result.client_secret)
    {
      // Make API route to create a ride
    }

    const { clientSecret, error } = await response.json();
    if(clientSecret)
    {
      intentCreationCallBack({clientSecret})
    }
    else{
      intentCreationCallBack({error})
    }
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
}
export default StripePaymentButton