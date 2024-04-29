import React, { useEffect, useState } from 'react';
import Header from '../components/Header'
import Cards from '../components/Cards'
import { Modal } from 'antd';
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { auth, db } from '../firebase';
import moment from 'moment';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import TransactionsTable from '../components/TransactionsTables';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';



function Dashboard() { 


  const [transactions ,setTransactions] = useState ([]);
  const [loading , setLoading] = useState(false); 
  const [user] = useAuthState(auth);
  const [income , setIncome] = useState(0);
  const [expense , setExpense] = useState(0);
  const [totalBalance , setTotalBalance] = useState(0);
  
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  
  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
    
useEffect(() => {

  fetchTransactions();

}, [user]);
 

async function fetchTransactions() {
  setLoading(true);
  if (user) {
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      transactionsArray.push(doc.data());
    });
    setTransactions(transactionsArray);
    console.log("transacitions array" , transactionsArray)
    toast.success("Transactions Fetched!");
  }
  setLoading(false);
}




  // const transaction = [
  //   {
  //     type :"income",
  //     amount:"1200",
  //     tag:"Salary",
  //     name:"income-1",
  //     date:"2023-05-23"
  //   },
  //   {
  //     type :"expense",
  //     amount:"100",
  //     tag:"food",
  //     name:"expense-1",
  //     date:"2023-10-23"
  //   }
  // ]





  async function addTransaction(transaction , many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many)  toast.success("Transaction Added!");
        const newArr = transactions ;
        newArr.push(transaction);
        setTransactions(newArr);
        calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
      
    }
  }


  useEffect(() => {
    calculateBalance();
  },[transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
 
  let sortedTransactions = transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
 })


  return (
    <div>
      <Header />
      {loading?(<p>loading...</p>)
      :
      (<>
      <Cards 
      income = {income}
      expense={expense}
      totalBalance = {totalBalance}
      
      showExpenseModal={showExpenseModal}  showIncomeModal={showIncomeModal} />

      <AddIncomeModal  style={{ fontWeight: 600 }}
      title="Add Income"
      isIncomeModalVisible={isIncomeModalVisible}
      handleIncomeCancel={handleIncomeCancel}
      footer={null}
      onFinish={onFinish}/> 

      { transactions && transactions.length != 0 ? (<ChartComponent sortedTransactions={sortedTransactions}/>)
       :(<NoTransactions/>)}
      <AddExpenseModal   style={{ fontWeight: 600 }}
      title="Add Expense"
      isExpenseModalVisible={isExpenseModalVisible}
      handleExpenseCancel={handleExpenseCancel}
      footer={null}
      onFinish={onFinish}/> 
       </>)}

       <TransactionsTable   transactions ={transactions} 
       addTransaction={addTransaction}
        fetchTransactions={fetchTransactions}/>
    </div>
   
  )
}

export default Dashboard;