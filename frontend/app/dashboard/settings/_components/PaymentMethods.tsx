"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: 'Expires 12/2025',
      isDefault: true,
      icon: '/visa.svg'
    },
    {
      id: '2',
      type: 'paypal',
      name: 'PayPal',
      details: 'john.doe@example.com',
      isDefault: false,
      icon: '/paypal.svg'
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cardName: '',
    email: ''
  });
  
  const setDefaultMethod = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    toast.success("Default payment method updated");
  };
  
  const removeMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };

  const handleAddMethod = () => {
    if (newMethod.type === 'card') {
      if (!newMethod.cardNumber || !newMethod.expiryDate || !newMethod.cardName) {
        toast.error("Please fill all required fields");
        return;
      }

      // In a real app, you would validate card details and make an API call
      const lastFour = newMethod.cardNumber.slice(-4);
      const newCard: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        name: `Card ending in ${lastFour}`,
        details: `Expires ${newMethod.expiryDate}`,
        isDefault: paymentMethods.length === 0,
        icon: '/visa.svg' // This would be determined by card type in a real app
      };

      setPaymentMethods([...paymentMethods, newCard]);
      toast.success("New payment method added");
    } else if (newMethod.type === 'paypal') {
      if (!newMethod.email) {
        toast.error("Please enter your PayPal email");
        return;
      }

      const newPaypal: PaymentMethod = {
        id: Date.now().toString(),
        type: 'paypal',
        name: 'PayPal',
        details: newMethod.email,
        isDefault: paymentMethods.length === 0,
        icon: '/paypal.svg'
      };

      setPaymentMethods([...paymentMethods, newPaypal]);
      toast.success("PayPal account added");
    }

    // Reset form
    setNewMethod({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cardName: '',
      email: ''
    });
    setShowAddForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-2xl border border-white/20 p-6"
    >
      <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-blue-500/10 opacity-30 transition-opacity duration-700"></div>
      
      <h2 className="text-xl font-bold text-white mb-6 relative z-10">Payment Methods</h2>
      
      {/* Payment Methods List */}
      <div className="space-y-4 mb-6 relative z-10">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <Image src={method.icon} alt={method.type} width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{method.name}</h3>
                    <p className="text-xs text-gray-400">{method.details}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                      Default
                    </span>
                  ) : (
                    <Button
                      onClick={() => setDefaultMethod(method.id)}
                      className="text-xs px-2 py-1 h-auto bg-white/10 hover:bg-white/20 text-white"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    onClick={() => removeMethod(method.id)}
                    className="p-1 h-auto bg-transparent hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No payment methods added yet</p>
          </div>
        )}
      </div>
      
      {/* Add New Payment Method */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20 relative z-10"
        >
          <Plus size={16} />
          Add Payment Method
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-lg mb-4 relative z-10"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Type</label>
            <div className="flex gap-3">
              <Button
                onClick={() => setNewMethod({...newMethod, type: 'card'})}
                className={`flex-1 ${newMethod.type === 'card' 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white' 
                  : 'bg-white/10 text-gray-300'}`}
              >
                <CreditCard size={16} className="mr-2" />
                Credit Card
              </Button>
              <Button
                onClick={() => setNewMethod({...newMethod, type: 'paypal'})}
                className={`flex-1 ${newMethod.type === 'paypal' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-white/10 text-gray-300'}`}
              >
                <Image src="/paypal.svg" alt="PayPal" width={16} height={16} className="mr-2" />
                PayPal
              </Button>
            </div>
          </div>
          
          {newMethod.type === 'card' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={newMethod.cardNumber}
                  onChange={(e) => setNewMethod({...newMethod, cardNumber: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="**** **** **** ****"
                  maxLength={16}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    value={newMethod.expiryDate}
                    onChange={(e) => setNewMethod({...newMethod, expiryDate: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="***"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-2">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  value={newMethod.cardName}
                  onChange={(e) => setNewMethod({...newMethod, cardName: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-300 mb-2">PayPal Email</label>
              <input
                type="email"
                id="paypalEmail"
                value={newMethod.email}
                onChange={(e) => setNewMethod({...newMethod, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleAddMethod}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/20"
            >
              Add Method
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentMethods;