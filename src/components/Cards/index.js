import React from 'react';
import '../Cards/styles.css';
import { Card, Row } from 'antd';
import Button from '../Button';


function Cards({
    income ,
    expense ,
    totalBalance ,
    
    showExpenseModal , showIncomeModal}) {
  return (
    <div>
       <Row className='my-row'>
       <Card bordered={true} className='my-card'>
        <h2>Current Balance</h2>
        <p>₹{totalBalance}</p>
        <Button blue={true} text="Reset Balance"/>
      </Card>

      <Card bordered={true} className='my-card' >
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <Button blue={true} text="Add Income" onClick={showIncomeModal}  />
      </Card>

      <Card bordered={true} className='my-card'>
        <h2>Total Expenses</h2>
        <p>₹{expense}</p>
        <Button  blue={true} text='Add Expense' onClick={ showExpenseModal} />
      </Card>
       </Row>
    </div>
  )
}

export default Cards;