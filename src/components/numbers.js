import React from 'react';
import './numbers.css';

const Numbers = (props) => {  
    const numberClassName = (number) => {
      if(props.selectedNumbers.indexOf(number) >= 0) {
        return 'selected';
    } 
    if(props.usedNumbers.includes(number)) {
        return 'used';
    }
  }
  return (
    <div className="card text-center">
      <div>
          {Numbers.list.map((number, i) => 
            <span key={i} className={numberClassName(number)}
          onClick={() => props.selectNumber(number)}>{number}</span>
        )}
      </div>
    </div>
  )
}

export default Numbers;