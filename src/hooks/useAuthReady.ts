import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

/**
 * useAuthReady Hook: 
 * Firebase Auth SDK সম্পূর্ণভাবে ইনিশিয়ালাইজড এবং ইউজার স্টেট চেক সম্পন্ন না হওয়া পর্যন্ত অপেক্ষা করে।
 *
 * @returns { isAuthReady: boolean } যখন Firebase Auth প্রস্তুত, তখন true রিটার্ন করে।
 */
export const useAuthReady = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Firebase Auth ইনস্ট্যান্স নিন
    const auth = getAuth(); 

    // onAuthStateChanged লিসেনার সেটআপ করুন। 
    // এই লিসেনারটি প্রথমবার কল হয় যখন Firebase নিশ্চিত করে যে Auth স্টেট লোড হয়েছে।
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Auth স্টেট একবার চেক হয়ে গেলেই আমরা প্রস্তুত
      setIsAuthReady(true);
      // console.log("Firebase Auth Status Ready. Current User:", user);
    });

    // কম্পোনেন্টটি আনমাউন্ট হলে লিসেনারটি মুছে ফেলুন (cleanup)
    return () => unsubscribe();
  }, []);

  return { isAuthReady };
};